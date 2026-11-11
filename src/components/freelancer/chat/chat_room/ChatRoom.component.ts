import { ref, onMounted, inject, nextTick, toRefs, watch, defineComponent } from 'vue';
import RestChat from '@/libs/RestChat';
import RestClientJobs from '@/libs/RestClientJobs';
import RestUserSession from '@/libs/RestUserSession';
import { ModalVue } from './modal';
import Loading from '@/components/loading/Loading.component';
import type { AxiosInstance } from 'axios';

export default defineComponent({
  components: {
    ModalVue,
    Loading,
  },
  props: {
    client: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { client } = toRefs(props),
      ws = inject<WebSocket>('ws'),
      messages = ref<Message[]>([]),
      newMessage = ref(''),
      messagesRef = ref<HTMLDivElement | null>(null),
      axios = inject<AxiosInstance>('axios');

    const resClientJobPost = new RestClientJobs(axios!);
    const JobPost = ref<JobPost | null>(null);
    let user = ref<User | null>(null);
    const restChat = new RestChat(axios!);
    const menuIsShow = ref(false);
    const isModalOpen = ref(false);
    const isLoading = ref(false);

    const connect = () => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return;
      }
      ws.send(JSON.stringify({
        type: 'connect',
        userId: user.value?.id,
        channelId: client.value.client.id,
        JobPostId: JobPost.value?.id,
      }));
    };

    const sendMessage = async () => {
      if (newMessage.value.trim() !== '') {
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'message',
            userId: user.value?.id,
            message: newMessage.value,
            channelId: client.value.client.id,
            JobPostId: JobPost.value?.id,
          }));
        }
        const res = await restChat.storeMessage(newMessage.value, client.value.id);
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
        const response = await resClientJobPost.getById(client.value.job_post_id);
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
        const res = await restChat.getAllMessages(client.value.id);
        if (res.isSuccess()) {
          messages.value = res.value!;
          console.log(messages.value)
        }
      } catch (err) {
        console.log(err);
      } finally {
        isLoading.value = false;
        nextTick(() => {
          if (messagesRef.value) {
            messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
          }
        });
      }
    };

    const openModal = () => {
      isModalOpen.value = true;
    };

    watch(client, async (newClient) => {
      if (newClient) {
        let restUserSession = new RestUserSession(axios!);
        user.value = (await restUserSession.getInfo()).value!.user;

        // Ensure JobPost and messages are loaded before connecting
        await getJobPostById();
        await getAllMessages();
        connect();
      }
    }, { immediate: true });

    onMounted(async () => {
      let restUserSession = new RestUserSession(axios!);
      user.value = (await restUserSession.getInfo()).value!.user;

      // Ensure JobPost and messages are loaded before connecting
      await getJobPostById();
      await getAllMessages();
      connect();
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
            const Isosdate = date.toISOString();
            message.created_at = Isosdate;
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

      if (client.value) {
        getJobPostById();
      }
    });

    const formatTime = (dateString: string) => {
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    const toggleChatScreen = () => {
      emit('chatState', 'toggleChat')
    }

    return {
      messages,
      newMessage,
      sendMessage,
      messagesRef,
      JobPost,
      user,
      menuIsShow,
      openModal,
      isModalOpen,
      isLoading,
      toggleChatScreen,
      formatTime
    };
  },
});
