import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { inject, onMounted, ref } from "vue";

export default {
  components: { ClientHeaderVue , ClientFooterVue  },
  setup() {   
    
    let services = ref([]);
    
    const axios = inject('axios');
    const restFreelancerServices = new RestFreelancerServices(axios);

    onMounted(async () => {
      let response = await restFreelancerServices.getAll2();
      console.log(response);
      if(response.data){
          services.value = response.data;
      }
      });

    return {
    services , 

    };
  },
};
