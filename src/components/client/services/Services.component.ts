import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { inject, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import type { AxiosInstance } from 'axios';

export default {
  components: { ClientHeaderVue, ClientFooterVue },
  setup() {

    const services = ref<Service[]>([]);
    const isLoading = ref(true);
    let route = useRoute();
    const axios = inject<AxiosInstance>('axios');
    const restFreelancerServices = new RestFreelancerServices(axios!);

    const fetchServices = async () => {
      isLoading.value = true;
      try {
        const titleQuery = route.query.title;
        const query = typeof titleQuery === 'string' ? titleQuery.trim() : '';

        if (!query || query === 'undefined') {
          let response = await restFreelancerServices.getAll2();
          if (response.isSuccess()) {
            services.value = response.value || [];
          }
        } else {
          let searchResponse = await restFreelancerServices.searchByTitle(query);
          if (searchResponse.isSuccess()) {
            services.value = searchResponse.value || [];
          }
        }
      } catch (err) {
        console.error("Error loading services:", err);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      fetchServices();
    });

    watch(
      () => route.query.title,
      () => {
        fetchServices();
      }
    );

    return {
      services,
      isLoading,
    };
  },
};
