import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

export default {
  components: { ClientHeaderVue , ClientFooterVue  },
  setup() {   
    
    const services = ref(null);
    let route = useRoute();
    const axios = inject('axios');
    const restFreelancerServices = new RestFreelancerServices(axios);

    onMounted(async () => {
      const query = route.query.title
      if (!query){
        let response = await restFreelancerServices.getAll2();
        if(response.data){
            services.value = response.data || [];
        }
      }
      else{
        let searchResponse = await restFreelancerServices.searchByTitle(query);
        if(searchResponse.data){
            services.value = searchResponse.data;
        }
      }
      });

    return {
    services ,
    };
  },
};
