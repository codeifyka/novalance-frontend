import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { JobPostVue } from '@/components/job_post';
import { inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import RestChat from '@/libs/RestChat';
import { ChatRoomVue } from './chat_room';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import type { AxiosInstance } from 'axios';

export default {
    components: { FreeLancerHeaderVue, JobPostVue, ChatRoomVue },
    setup() {
        const route = useRoute();
        const colors = ref({
            'text': 'text-purple-700',
            'background': "bg-violet-50/60",
        });
        const isLoading = ref(false);
        const axios = inject<AxiosInstance>("axios");
        const restChat = new RestChat(axios!);
        const clients = ref<Chat[]>([]);
        const currentUser = ref<Chat | null>(null);
        const chatScreenState = ref(true);

        const truncatedMessage = (msg?: string) => {
            const message = msg || "";
            return message.length > 25 ? `${message.slice(0, 25)}...` : message;
        };

        const getClients = async () => {
            try {
                const response = await restChat.getUsers();
                if (response.isSuccess()) {
                    clients.value = response.value!;
                    const targetChatId = route.query.chatId ? Number(route.query.chatId) : null;
                    const targetUserId = route.query.userId ? Number(route.query.userId) : null;
                    const targetJobId = route.query.jobPostId ? Number(route.query.jobPostId) : null;

                    if (targetChatId) {
                        currentUser.value = clients.value.find((c) => c.id === targetChatId) || null;
                    }
                    if (!currentUser.value && targetUserId) {
                        currentUser.value = clients.value.find((c) => c.client_id === targetUserId && (!targetJobId || c.job_post_id === targetJobId))
                            || clients.value.find((c) => c.client_id === targetUserId)
                            || null;
                    }
                    if (!currentUser.value && targetUserId) {
                        const res = await restChat.getOrCreateChat(targetUserId, targetJobId || undefined);
                        if (res.isSuccess() && res.value) {
                            const existingIdx = clients.value.findIndex(c => c.id === res.value!.id);
                            if (existingIdx === -1) {
                                clients.value.unshift(res.value);
                            }
                            currentUser.value = res.value;
                        }
                    }
                    if (!currentUser.value) {
                        currentUser.value = clients.value[0] || null;
                    }
                    if (currentUser.value) {
                        chatScreenState.value = true;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        };

        const ChangeCurrentUser = (chat_id: number): void => {
            currentUser.value = clients.value.find(fr => fr.id == chat_id) || null;
            chatScreenState.value = true;
        };

        const handleMessage = (message: any) => {
            const target = clients.value.find(
                client => client.job_post_id == message.JobPostId && client.client_id == message.userId
            ) || clients.value.find(client => client.client_id == message.userId);

            if (target) {
                target.last_message = {
                    ...(target.last_message || {}),
                    id: Date.now(),
                    message: message.message,
                    sender: message.userId,
                    reciever: currentUser.value?.freelancer_id || 0,
                    chat_id: target.id,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                } as Message;
            }
        };

        const toggleChatScreen = () => {
            chatScreenState.value = !chatScreenState.value;
        };

        onMounted(async () => {
            getClients();
        });

        return {
            colors,
            isLoading,
            clients,
            currentUser,
            ChangeCurrentUser,
            handleMessage,
            chatScreenState,
            toggleChatScreen,
            truncatedMessage,
            DEFAULT_PROFILE_PICTURE
        };
    }
}
