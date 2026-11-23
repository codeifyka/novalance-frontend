import { defineComponent, ref, watch } from 'vue';
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
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
        }
    },
    emits: ['close'],
    setup(props, { emit }) {
        const closeModal = () => {
            emit('close');
        };

        const axios = inject<AxiosInstance>('axios');
        const restFreelancerProjects = new RestFreelancerProjects(axios!);
        const projects = ref<Project[]>([]);

        // Wait for the async user data before loading their projects.
        watch(
            () => [props.client?.username, props.isOpen] as const,
            async ([username, isOpen]) => {
                if (!isOpen || !username) return;
                try {
                    const response = await restFreelancerProjects.getAll(username);
                    projects.value = response.isSuccess() ? response.value || [] : [];
                } catch (err) {
                    console.error('Failed to load projects:', err);
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
            enter,
            leave,
            projects
        };
    },
});
