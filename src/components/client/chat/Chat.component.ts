import { ClientHeaderVue } from "@/components/client/header";
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import RestChat from "@/libs/RestChat";
import { ClientChatRoomVue } from "./chat_room";
import { DEFAULT_PROFILE_PICTURE } from "@/consts";
import type { AxiosInstance } from "axios";

export default {
  components: { ClientHeaderVue, ClientChatRoomVue },
  setup() {
    const route = useRoute();
    const axios = inject<AxiosInstance>("axios");
    const restChat = new RestChat(axios!);
    const freelancers = ref<Chat[]>([]);
    const currentUser = ref<Chat | null>(null);
    const chatScreenState = ref(true);

    const truncatedMessage = (msg?: string) => {
      const message = msg || "";
      return message.length > 25 ? `${message.slice(0, 25)}...` : message;
    };

    const getFreelancers = async () => {
      try {
        const response = await restChat.getUsers();
        if (response.isSuccess()) {
          freelancers.value = response.value!;
          const targetChatId = route.query.chatId ? Number(route.query.chatId) : null;
          const targetUserId = route.query.userId ? Number(route.query.userId) : null;
          const targetJobId = route.query.jobPostId ? Number(route.query.jobPostId) : null;

          if (targetChatId) {
            currentUser.value = freelancers.value.find((fr) => fr.id === targetChatId) || null;
          }
          if (!currentUser.value && targetUserId) {
            currentUser.value = freelancers.value.find((fr) => fr.freelancer_id === targetUserId && (!targetJobId || fr.job_post_id === targetJobId))
              || freelancers.value.find((fr) => fr.freelancer_id === targetUserId)
              || null;
          }
          if (!currentUser.value && targetUserId) {
            const res = await restChat.getOrCreateChat(targetUserId, targetJobId || undefined);
            if (res.isSuccess() && res.value) {
              const existingIdx = freelancers.value.findIndex(f => f.id === res.value!.id);
              if (existingIdx === -1) {
                freelancers.value.unshift(res.value);
              }
              currentUser.value = res.value;
            }
          }
          if (!currentUser.value) {
            currentUser.value = freelancers.value[0] || null;
          }
          if (currentUser.value) {
            chatScreenState.value = true;
          }
        }
      } catch (err) {
        console.log(err);
      }
    };

    onMounted(() => {
      getFreelancers();
    });

    const ChangeCurrentUser = (chat_id: number) => {
      let user = freelancers.value.find((fr) => fr.id == chat_id);
      if (user) {
        currentUser.value = user;
        chatScreenState.value = true;
      }
    };

    const handleMessage = (message: any) => {
      const target = freelancers.value.find(
        (f) => f.job_post_id == message.JobPostId && f.freelancer_id == message.userId
      ) || freelancers.value.find((f) => f.freelancer_id == message.userId);

      if (target) {
        target.last_message = {
          ...(target.last_message || {}),
          id: Date.now(),
          message: message.message,
          sender: message.userId,
          reciever: currentUser.value?.client_id || 0,
          chat_id: target.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Message;
      }
    };

    const toggleChatScreen = () => {
      chatScreenState.value = !chatScreenState.value;
    };

    return {
      freelancers,
      currentUser,
      ChangeCurrentUser,
      handleMessage,
      chatScreenState,
      toggleChatScreen,
      truncatedMessage,
      DEFAULT_PROFILE_PICTURE,
    };
  },
};
