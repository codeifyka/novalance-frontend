import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { SliderVue } from "@/components/slider";
import { inject, onMounted, ref, type Ref } from "vue";
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

        const axios = inject<AxiosInstance>('axios');
        const toastManager = inject<Ref<ToastsManager>>("toastManager");
        const restFreelancerServices = new RestFreelancerServices(axios!);

        onMounted(async () => {
            let response = await restFreelancerServices.getById(Number(route.params.id));
            console.log(response);
            if (response.isSuccess()) {
                service.value = response.value!;
            }
        });

        const buyService = async () => {
            if (!service.value || isPurchasing.value) return;
            isPurchasing.value = true;
            try {
                let response = await restFreelancerServices.purchase(service.value.id);
                if (response.isSuccess()) {
                    toastManager?.value?.alertSuccess("Service purchased successfully!");
                    router.push("/my_purchases");
                } else {
                    toastManager?.value?.alertError(response.error || "Failed to purchase service.");
                }
            } catch (err: any) {
                toastManager?.value?.alertError("An unexpected error occurred.");
            } finally {
                isPurchasing.value = false;
            }
        };

        return {
            service,
            isPurchasing,
            buyService
        };
    }
}
