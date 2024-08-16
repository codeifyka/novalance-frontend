import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
    components: { FreeLancerHeaderVue },
    setup(){
        let route = useRoute();
        let services = ref(null);
        
        const axios = inject('axios');
        const restFreelancerServices = new RestFreelancerServices(axios);

        onMounted(async () => {
            let response = await restFreelancerServices.getAll(route.params.username);
            console.log(response);
            if(response.data){
                services.value = response.data || [];
            }
        });

        return { 
            services
        };
    }
}
