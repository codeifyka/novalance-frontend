import { PurchaseCardVue } from "@/components/purchase_card";
import { ClientFooterVue } from "../footer";
import { ClientHeaderVue } from "../header";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { ref, inject, onMounted } from "vue";
import type { AxiosInstance } from "axios";

export default {
    components: { PurchaseCardVue, ClientFooterVue, ClientHeaderVue },
    setup() {
        const axios = inject<AxiosInstance>('axios');
        const restServices = new RestFreelancerServices(axios!);
        const purchases = ref<Purchase[]>([]);
        const isLoading = ref(true);

        const fetchPurchases = async () => {
            isLoading.value = true;
            try {
                const response = await restServices.getPurchases();
                if (response.isSuccess()) {
                    purchases.value = response.value || [];
                }
            } catch (err) {
                console.error("Error fetching purchases:", err);
            } finally {
                isLoading.value = false;
            }
        };

        onMounted(() => {
            fetchPurchases();
        });

        return {
            purchases,
            isLoading,
            fetchPurchases,
        };
    }
}
