import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { SliderVue } from "@/components/slider";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosInstance } from 'axios';
import { ClientHeaderVue } from '../../header';
import { ClientFooterVue } from "../../footer";

export default {
    components: { ClientHeaderVue, SliderVue, ClientFooterVue },
    setup() {
        let route = useRoute();
        let service = ref<Service | null>(null);

        const axios = inject<AxiosInstance>('axios');
        const restFreelancerServices = new RestFreelancerServices(axios!);

        onMounted(async () => {
            let response = await restFreelancerServices.getById(Number(route.params.id));
            console.log(response);
            if (response.isSuccess()) {
                service.value = response.value!;
            }
        });

        return {
            service
        };
    }
}
