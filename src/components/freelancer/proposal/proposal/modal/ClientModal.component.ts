import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import RestClientJobs from '@/libs/RestClientJobs';
import RestChat from '@/libs/RestChat';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';

export default defineComponent({
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        client: {
            type: Object,
            required: true,
        },
        jobPostId: {
            type: Number,
            required: false,
        }
    },
    emits: ['close'],
    setup(props, { emit }) {
        const router = useRouter();
        const closeModal = () => {
            emit('close');
        };

        const axios = inject<AxiosInstance>('axios');
        const restClientJobs = new RestClientJobs(axios!);
        const restChat = new RestChat(axios!);
        const jobPosts = ref<JobPost[]>([]);
        const isLoading = ref(false);
        const isNavigatingToChat = ref(false);

        const goToChat = async () => {
            if (!props.client?.id) return;
            try {
                isNavigatingToChat.value = true;
                const res = await restChat.getOrCreateChat(props.client.id, props.jobPostId);
                const chatId = res.isSuccess() && res.value?.id ? res.value.id : undefined;
                closeModal();
                router.push({
                    path: '/chat',
                    query: {
                        ...(chatId ? { chatId } : {}),
                        userId: props.client.id,
                        ...(props.jobPostId ? { jobPostId: props.jobPostId } : {})
                    }
                });
            } catch (err) {
                console.error('Failed to open chat:', err);
                closeModal();
                router.push({
                    path: '/chat',
                    query: {
                        userId: props.client.id,
                        ...(props.jobPostId ? { jobPostId: props.jobPostId } : {})
                    }
                });
            } finally {
                isNavigatingToChat.value = false;
            }
        };

        watch(
            () => [props.client?.id, props.isOpen] as const,
            async ([clientId, isOpen]) => {
                console.log('Watcher triggered:', { clientId, isOpen, client: props.client });
                if (!isOpen || !clientId) return;
                isLoading.value = true;
                try {
                    console.log('Fetching job posts for client:', clientId);
                    const response = await restClientJobs.getAll({ user_id: clientId });
                    console.log('API response:', response);
                    jobPosts.value = response.isSuccess() ? response.value || [] : [];
                } catch (err) {
                    console.error('Failed to load client job posts:', err);
                    jobPosts.value = [];
                } finally {
                    isLoading.value = false;
                }
            },
            { immediate: true },
        );

        const enter = (el: HTMLElement, done: () => void) => {
            const animation = el.animate([
                { opacity: 0, transform: 'scale(0.9)' },
                { opacity: 1, transform: 'scale(1)' }
            ], {
                duration: 300,
                easing: 'ease-out'
            });

            animation.onfinish = done;
        };

        const leave = (el: HTMLElement, done: () => void) => {
            const animation = el.animate([
                { opacity: 1, transform: 'scale(1)' },
                { opacity: 0, transform: 'scale(0.9)' }
            ], {
                duration: 300,
                easing: 'ease-in'
            });

            animation.onfinish = done;
        };

        const getFileUrl = (filePath?: string): string => {
            if (!filePath) return '';
            if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
                return filePath;
            }
            if (filePath.startsWith('/')) {
                return filePath;
            }
            return `/${filePath}`;
        };

        const isImageFile = (filePath?: string): boolean => {
            if (!filePath) return false;
            return /\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(filePath);
        };

        return {
            closeModal,
            goToChat,
            isNavigatingToChat,
            enter,
            leave,
            jobPosts,
            isLoading,
            getFileUrl,
            isImageFile
        };
    },
});