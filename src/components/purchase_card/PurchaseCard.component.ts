import { useRouter } from 'vue-router';
import { computed, ref, inject, type Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import type ToastsManager from '@/libs/ToastsManager';
import RestFreelancerServices from '@/libs/RestFreelancerServices';
import Utils from '@/libs/Utils';

export default {
    props: {
        purchase: {
            type: Object as () => Purchase,
            required: true,
        },
    },
    emits: ['purchaseUpdated'],
    setup(props: { purchase: Purchase }, { emit }: any) {
        const router = useRouter();
        const axios = inject<AxiosInstance>('axios');
        const toastManager = inject<Ref<ToastsManager>>("toastManager");
        const restServices = new RestFreelancerServices(axios!);

        // Modal states
        const isCompleteModalOpen = ref(false);
        const isDisputeModalOpen = ref(false);
        const isExtendModalOpen = ref(false);

        const isSubmittingComplete = ref(false);
        const isSubmittingDispute = ref(false);
        const isSubmittingExtend = ref(false);

        const disputeReason = ref('');
        const newDeadline = ref('');

        const serviceImage = computed(() => {
            const images = props.purchase?.service?.images;
            if (images && images.length > 0) {
                return (images[0] as any).url || images[0].path || '/default_service_thumbnail.jpg';
            }
            return '/default_service_thumbnail.jpg';
        });

        const formattedStartDate = computed(() => {
            return Utils.formatDate(props.purchase?.started_at || props.purchase?.created_at);
        });

        const formattedDeadline = computed(() => {
            return Utils.formatDate(props.purchase?.ends_at);
        });

        const isDeadlinePassed = computed(() => {
            if (!props.purchase?.ends_at) return false;
            return new Date() >= new Date(props.purchase.ends_at);
        });

        const openChat = () => {
            router.push('/chat_client_freelancer');
        };

        const viewService = () => {
            if (props.purchase?.service_id) {
                router.push(`/service/${props.purchase.service_id}`);
            }
        };

        // Complete Order
        const confirmComplete = async () => {
            try {
                isSubmittingComplete.value = true;
                const res = await restServices.completePurchase(props.purchase.id);
                if (res.isSuccess()) {
                    toastManager?.value?.alertSuccess("Order approved! Escrow funds released to freelancer.");
                    isCompleteModalOpen.value = false;
                    emit('purchaseUpdated', res.value);
                } else {
                    toastManager?.value?.alertError(res.error || "Failed to complete order.");
                }
            } catch (err: any) {
                toastManager?.value?.alertError(err.message || "Failed to complete order.");
            } finally {
                isSubmittingComplete.value = false;
            }
        };

        // Submit Dispute
        const confirmDispute = async () => {
            if (!disputeReason.value.trim() || disputeReason.value.length < 10) {
                toastManager?.value?.alertError("Please provide a reason of at least 10 characters.");
                return;
            }

            try {
                isSubmittingDispute.value = true;
                const res = await restServices.disputePurchase(props.purchase.id, disputeReason.value);
                if (res.isSuccess()) {
                    toastManager?.value?.alertSuccess("Dispute opened. Admin will review chat and details.");
                    isDisputeModalOpen.value = false;
                    props.purchase.status = 'disputed';
                    emit('purchaseUpdated', props.purchase);
                } else {
                    toastManager?.value?.alertError(res.error || "Failed to submit dispute.");
                }
            } catch (err: any) {
                toastManager?.value?.alertError(err.message || "Failed to submit dispute.");
            } finally {
                isSubmittingDispute.value = false;
            }
        };

        // Extend Deadline
        const openExtendModal = () => {
            newDeadline.value = props.purchase?.ends_at ? props.purchase.ends_at.split('T')[0] : '';
            isExtendModalOpen.value = true;
        };

        const confirmExtend = async () => {
            if (!newDeadline.value) {
                toastManager?.value?.alertError("Please select a new deadline.");
                return;
            }

            try {
                isSubmittingExtend.value = true;
                const res = await restServices.extendPurchase(props.purchase.id, newDeadline.value);
                if (res.isSuccess()) {
                    toastManager?.value?.alertSuccess("Deadline extended successfully.");
                    isExtendModalOpen.value = false;
                    emit('purchaseUpdated', res.value);
                } else {
                    toastManager?.value?.alertError(res.error || "Failed to extend deadline.");
                }
            } catch (err: any) {
                toastManager?.value?.alertError(err.message || "Failed to extend deadline.");
            } finally {
                isSubmittingExtend.value = false;
            }
        };

        return {
            serviceImage,
            formattedStartDate,
            formattedDeadline,
            isDeadlinePassed,
            openChat,
            viewService,
            isCompleteModalOpen,
            isDisputeModalOpen,
            isExtendModalOpen,
            isSubmittingComplete,
            isSubmittingDispute,
            isSubmittingExtend,
            disputeReason,
            newDeadline,
            confirmComplete,
            confirmDispute,
            openExtendModal,
            confirmExtend,
        };
    }
}
