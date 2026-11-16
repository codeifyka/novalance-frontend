import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import { JobPostVue } from '@/components/job_post';
import RestClientJobs from "@/libs/RestClientJobs";
import { ref, inject, onMounted } from 'vue'
import type { AxiosInstance } from 'axios';

export default {
  components: { ClientHeaderVue, ClientFooterVue, JobPostVue },
  setup() {
    const axios = inject<AxiosInstance>('axios');
    let Jobs = ref<JobPost[]>([])
    let restClientJobs = new RestClientJobs(axios!)
    const colors = ref({
      'text': 'text-regal-brown',
      'background': "bg-white",
    });
    const isLoading = ref(true);
    const activity = ref<JobActivity>({
      active_jobs: 0,
      new_proposals: 0,
      hiring: 0,
    });

    const fetchData = async () => {
      isLoading.value = true;
      try {
        const response = await restClientJobs.getMyJobs();

        if (response.isSuccess()) {
          Jobs.value = response.value?.jobs || [];
          if (response.value?.activity) {
            activity.value = response.value.activity;
          }
        } else {
          console.log(response);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      } finally {
        isLoading.value = false;
      }
    };

    function removeJobCard(jobId: number) {
      // Find and remove the job from the list and decrement active jobs
      Jobs.value = Jobs.value.filter(job => job.id !== jobId);
      activity.value.active_jobs = Math.max(0, activity.value.active_jobs - 1);
    }

    onMounted(fetchData);

    return {
      Jobs,
      colors,
      activity,
      isLoading,
      removeJobCard
    };
  },
};
