import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import RestClientJobs from "@/libs/RestClientJobs";
import { useRoute } from "vue-router";
import { JobPostVue } from '@/components/job_post';
import { inject, ref, onMounted } from 'vue'
import type { AxiosInstance } from 'axios';
export default {
  components: { ClientHeaderVue, ClientFooterVue, JobPostVue },
  setup() {
    let route = useRoute();
    const axios = inject<AxiosInstance>('axios');
    const restClientJobs = new RestClientJobs(axios!);
    const jobId = route.params.id
    let job = ref<JobPost | null>(null);
    let isLoading = ref<boolean>(true);
    const colors = ref({
      'text': 'text-regal-brown',
      'background': "bg-white",
    })
    onMounted(async () => {
      isLoading.value = true;
      try {
        let response = await restClientJobs.getById(Number(jobId));
        console.log(response);
        if (response.isSuccess()) {
          job.value = response.value!;
        }
      } catch (error) {
        console.error("Failed to load job details:", error);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      job, colors, isLoading
    };
  },
};
