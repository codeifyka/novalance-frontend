import { ref, onMounted, inject, nextTick, toRefs, watch, defineComponent, type Ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import RestChat from '@/libs/RestChat';
import RestClientJobs from '@/libs/RestClientJobs';
import RestUserSession from '@/libs/RestUserSession';
import { ModalVue } from './modal';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import type { AxiosInstance } from 'axios';
import type ToastsManager from '@/libs/ToastsManager';
import Utils from '@/libs/Utils';

export default defineComponent({
  components: {
    ModalVue
  },
  props: {
    freelancer: {
      required: true,
      type: Object as () => Chat,
    },
  },
  setup(props, { emit }) {
    const ws = inject<WebSocket>('ws'),
      messages = ref<Message[]>([]),
      newMessage = ref(''),
      messagesRef = ref<HTMLDivElement | null>(null),
      menuContainerRef = ref<HTMLDivElement | null>(null),
      isLoading = ref(false),
      axios = inject<AxiosInstance>('axios');
    const resClientJobPost = new RestClientJobs(axios!);
    const JobPost = ref<JobPost | null>(null);
    let user = ref<User | null>(null);
    const restChat = new RestChat(axios!)
    const menuIsShow = ref(false)
    const isModalOpen = ref(false)
    const toastManager = inject<Ref<ToastsManager>>("toastManager")
    const { freelancer } = toRefs(props);

    onClickOutside(menuContainerRef, () => {
      menuIsShow.value = false;
    });

    const connect = () => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return;
      }

      ws.send(JSON.stringify({ type: 'connect', userId: user.value?.id, channelId: freelancer.value?.freelancer_id, JobPostId: JobPost.value?.id }));
    };

    const sendMessage = async () => {
      if (newMessage.value.trim() !== '') {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'message', userId: user.value?.id, message: newMessage.value, channelId: freelancer.value?.freelancer_id, JobPostId: JobPost.value?.id }));
        }
        const res = await restChat.storeMessage(newMessage.value, freelancer.value?.id);
        if (res.isSuccess()) {
          newMessage.value = '';
          messages.value.push(res.value!);
          if (messagesRef.value?.scrollTop) {
            messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
          }
        }
      }
    };

    const getJobPostById = async () => {
      try {
        const jobId = freelancer.value?.job_post_id || (freelancer.value?.chattable_type?.includes('JobPost') ? freelancer.value?.chattable_id : null);
        if (!jobId) return;
        const response = await resClientJobPost.getById(jobId);
        if (response.isSuccess()) {
          JobPost.value = response.value!;
        }
      } catch (error) {
        console.error('Error fetching job post:', error);
      }
    };

    const getAllMessages = async () => {
      try {
        isLoading.value = true;
        const res = await restChat.getAllMessages(freelancer.value?.id);
        if (res.isSuccess()) {
          messages.value = res.value!;
        }
      } catch (err) {
        console.log(err)
      } finally {
        isLoading.value = false;
        nextTick(() => {
          if (messagesRef.value) {
            messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
          }
        });
      }
    }

    const openModal = () => {
      isModalOpen.value = true;
    }

    watch(freelancer, async (newFreelancer) => {
      if (newFreelancer) {
        let restUserSession = new RestUserSession(axios!);
        user.value = (await restUserSession.getInfo()).value!.user;
        // Ensure JobPost and messages are loaded before connecting
        await getJobPostById();
        await getAllMessages();
        connect()
      }
    }, { immediate: true });

    onMounted(async () => {
      let restUserSession = new RestUserSession(axios!);
      user.value = (await restUserSession.getInfo()).value!.user;
      connect();
      getAllMessages()
    });

    onMounted(() => {
      if (!ws) {
        return;
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Received message:', message);
          if (message.channelId === user.value?.id && message.JobPostId == JobPost.value?.id) {
            const date = new Date();
            const Isosdate = date.toISOString()
            message.created_at = Isosdate
            messages.value = Array.isArray(messages.value) ? [...messages.value, message] : [message];
            nextTick(() => {
              if (messagesRef.value) {
                messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
              }
            });
          }
          emit('received-message', message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      if (freelancer.value) {
        getJobPostById();
      }
    });

    const handleSend = async (payload: { end_date: Date | string, temporary_removed: boolean } | any) => {
      try {
        isLoading.value = true;
        const targetEndDate = (typeof payload === 'object' && payload !== null && 'end_date' in payload)
          ? payload.end_date
          : payload;
        const targetTempRemoved = (typeof payload === 'object' && payload !== null && 'temporary_removed' in payload)
          ? Boolean(payload.temporary_removed)
          : false;

        console.log('expiry date Sent:', targetEndDate, 'temporary_removed:', targetTempRemoved);
        let response = await restChat.setExpiryDate(freelancer.value.id, targetEndDate as any, targetTempRemoved);
        if (response && response.isSuccess()) {
          toastManager?.value?.alertSuccess?.("Set expiry date successfully.");
          if (freelancer.value) {
            freelancer.value.end_date = String(targetEndDate);
            freelancer.value.temporary_removed = targetTempRemoved;
          }
          isModalOpen.value = false;
        } else {
          toastManager?.value?.alertError?.(response?.error || "Failed to set expiry date.");
        }
      } catch (error: any) {
        console.log(error);
        toastManager?.value?.alertError?.(error?.message || String(error));
      } finally {
        isLoading.value = false;
      }
    };

    const toggleChatScreen = () => {
      emit('chatState', 'toggleChat')
    }

    const formatTime = (dateString?: string) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    return {
      messages,
      newMessage,
      sendMessage,
      messagesRef,
      JobPost,
      user,
      isLoading,
      menuIsShow,
      menuContainerRef,
      openModal,
      isModalOpen,
      handleSend,
      toggleChatScreen,
      formatTime,
      formatDate: Utils.formatDate,
      DEFAULT_PROFILE_PICTURE,
    };
  },
});
