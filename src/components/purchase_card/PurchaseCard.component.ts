import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
    props: {
        purchase: {
            type: Object as () => Purchase,
            required: true,
        },
    },
    setup(props: { purchase: Purchase }) {
        const router = useRouter();

        const serviceImage = computed(() => {
            const images = props.purchase?.service?.images;
            if (images && images.length > 0) {
                return (images[0] as any).url || images[0].path || '/default_service_thumbnail.jpg';
            }
            return '/default_service_thumbnail.jpg';
        });

        const formattedDate = computed(() => {
            if (!props.purchase?.created_at) return '';
            try {
                return new Date(props.purchase.created_at).toLocaleDateString();
            } catch {
                return props.purchase.created_at;
            }
        });

        const openChat = () => {
            router.push('/chat_client_freelancer');
        };

        const viewService = () => {
            if (props.purchase?.service_id) {
                router.push(`/service/${props.purchase.service_id}`);
            }
        };

        return {
            serviceImage,
            formattedDate,
            openChat,
            viewService
        };
    }
}
