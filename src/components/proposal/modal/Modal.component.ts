import { defineComponent, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import RestChat from '@/libs/RestChat';
import { inject } from 'vue';
import type { AxiosInstance } from 'axios';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';

export default defineComponent({
    props: {
        isOpen: {
            type: Boolean,
            required: true,
        },
        freelancer: {
            type: Object as () => User,
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
        const axios = inject<AxiosInstance>('axios');
        const restFreelancerProjects = new RestFreelancerProjects(axios!);
        const restChat = new RestChat(axios!);
        const projects = ref<Project[]>([]);
        const isNavigatingToChat = ref(false);

        const closeModal = () => {
            emit('close');
        };

        const goToChat = async () => {
            if (!props.freelancer?.id) return;
            try {
                isNavigatingToChat.value = true;
                const res = await restChat.getOrCreateChat(props.freelancer.id, props.jobPostId);
                const chatId = res.isSuccess() && res.value?.id ? res.value.id : undefined;
                closeModal();
                router.push({
                    path: '/chat',
                    query: {
                        ...(chatId ? { chatId } : {}),
                        userId: props.freelancer.id,
                        ...(props.jobPostId ? { jobPostId: props.jobPostId } : {})
                    }
                });
            } catch (err) {
                console.error('Failed to open chat:', err);
                closeModal();
                router.push({
                    path: '/chat',
                    query: {
                        userId: props.freelancer.id,
                        ...(props.jobPostId ? { jobPostId: props.jobPostId } : {})
                    }
                });
            } finally {
                isNavigatingToChat.value = false;
            }
        };

        // The freelancer is fetched asynchronously by the parent, so wait until
        // it exists (and the modal is opened) before loading their projects.
        watch(
            () => [props.freelancer?.username, props.isOpen] as const,
            async ([username, isOpen]) => {
                if (!isOpen || !username) return;
                try {
                    const response = await restFreelancerProjects.getAll(username);
                    projects.value = response.isSuccess() ? response.value || [] : [];
                } catch (err) {
                    console.error('Failed to load freelancer projects:', err);
                    projects.value = [];
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

        return {
            closeModal,
            goToChat,
            isNavigatingToChat,
            enter,
            leave,
            projects,
            DEFAULT_PROFILE_PICTURE
        };
    },
});
