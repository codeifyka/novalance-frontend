import RestFreelancerServices from "@/libs/RestFreelancerServices";
import RestWallet from "@/libs/RestWallet";
import { SliderVue } from "@/components/slider";
import { inject, onMounted, ref, computed, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { AxiosInstance } from 'axios';
import type ToastsManager from "@/libs/ToastsManager";
import { ClientHeaderVue } from '../../header';
import { ClientFooterVue } from "../../footer";

export default {
    components: { ClientHeaderVue, SliderVue, ClientFooterVue },
    setup() {
        let route = useRoute();
        let router = useRouter();
        let service = ref<Service | null>(null);
        let isPurchasing = ref(false);
        const isCheckoutModalOpen = ref(false);
        const clientWallet = ref<WalletSummary | null>(null);
        const deliveryDeadline = ref<string>('');
        const isDepositing = ref(false);

        const axios = inject<AxiosInstance>('axios');
        const toastManager = inject<Ref<ToastsManager>>("toastManager");
        const restFreelancerServices = new RestFreelancerServices(axios!);
        const restWallet = new RestWallet(axios!);

        onMounted(async () => {
            let response = await restFreelancerServices.getById(Number(route.params.id));
            if (response.isSuccess()) {
                service.value = response.value!;
            }
        });

        const servicePrice = computed(() => {
            return service.value?.price ? Number(service.value.price.value) : 0;
        });

        const walletBalance = computed(() => {
            return clientWallet.value ? Number(clientWallet.value.balance) : 0;
        });

        const balanceDeficit = computed(() => {
            return Math.max(0, servicePrice.value - walletBalance.value);
        });

        const openCheckoutModal = async () => {
            if (!service.value) return;

            // Compute default completion date based on service delivery_days (default 3)
            const days = service.value.delivery_days || 3;
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + days);
            deliveryDeadline.value = targetDate.toISOString().split('T')[0];

            try {
                const walletRes = await restWallet.getMyWallet();
                if (walletRes.isSuccess() && walletRes.value) {
                    clientWallet.value = walletRes.value;
                }
            } catch (err) {
                console.error("Failed to fetch wallet:", err);
            }

            isCheckoutModalOpen.value = true;
        };

        const confirmPurchase = async () => {
            if (!service.value || isPurchasing.value) return;

            try {
                isPurchasing.value = true;
                let response = await restFreelancerServices.purchase(service.value.id, deliveryDeadline.value);
                if (response.isSuccess()) {
                    toastManager?.value?.alertSuccess("Service purchased! Funds secured in escrow.");
                    isCheckoutModalOpen.value = false;
                    router.push("/my_purchases");
                } else {
                    toastManager?.value?.alertError(response.error || "Failed to purchase service.");
                }
            } catch (err: any) {
                const message = err.response?.data?.error || err.message || "Failed to purchase service.";
                toastManager?.value?.alertError(message);
            } finally {
                isPurchasing.value = false;
            }
        };

        const depositAndPurchase = async () => {
            if (!service.value || isDepositing.value) return;

            try {
                isDepositing.value = true;
                const deficitAmount = balanceDeficit.value;
                if (deficitAmount > 0) {
                    // One-click deposit via Stripe gateway
                    const depRes = await restWallet.confirmDeposit(
                        `sim_${Date.now()}`,
                        deficitAmount,
                        'stripe'
                    );

                    if (!depRes.isSuccess()) {
                        toastManager?.value?.alertError("Deposit failed. Please try again.");
                        return;
                    }

                    // Refresh wallet
                    const updatedWallet = await restWallet.getMyWallet();
                    if (updatedWallet.isSuccess() && updatedWallet.value) {
                        clientWallet.value = updatedWallet.value;
                    }
                }

                // Proceed with escrow lock
                await confirmPurchase();
            } catch (err: any) {
                const message = err.response?.data?.error || err.message || "Checkout failed.";
                toastManager?.value?.alertError(message);
            } finally {
                isDepositing.value = false;
            }
        };

        return {
            service,
            servicePrice,
            walletBalance,
            balanceDeficit,
            isPurchasing,
            isDepositing,
            isCheckoutModalOpen,
            clientWallet,
            deliveryDeadline,
            openCheckoutModal,
            confirmPurchase,
            depositAndPurchase,
        };
    }
}
