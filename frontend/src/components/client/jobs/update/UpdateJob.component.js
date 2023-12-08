import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import RestClientJobs from "@/libs/RestClientJobs";
import { useRoute } from "vue-router";
import {inject,ref,onMounted} from 'vue'
export default {
  components: { ClientHeaderVue , ClientFooterVue  },
  setup() {   
    // Data
    const title = ref()
    const description = ref('')
    const skills = ref('')
    const selectedSize = ref('')
    const selectedLevel = ref('')
    const budjet = ref('')
    const time = ref('')
    const files = ref('file.pdf')

    let toastManager = inject("toastManager");
    let route = useRoute();
    const axios = inject('axios');
    const restClientJobs = new RestClientJobs(axios);
    const jobId = route.params.id

    onMounted(async () => {
        let response = await restClientJobs.getById(jobId);
        console.log(response);
        if(response.data){
            let job = response.data;
            title.value=job.title;
            description.value=job.description;
            selectedSize.value=job.size;
            selectedLevel.value=job.experience_level;
            budjet.value=job.budjet;
            time.value=job.expected_delivery_time;
            files.value=job.illustrative_files;
            console.log(title.value)
        }
    });
    
    let onSubmit = async() =>{
      let restClientJobs = new RestClientJobs(axios)
      try {
        let response = await  restClientJobs.update(jobId,{
          title:title.value,
          description:description.value,
          skills:skills.value,
          level:selectedLevel.value,
          size:selectedSize.value,
          budjet:budjet.value,
          time:time.value,
          files:files.value,
          expected_delivery_time:time.value
        });
        if(response.data){
          console.log(response.data)
          toastManager.value.alertSuccess('Job post updated successfuly');
          setTimeout(() => {
            window.location.href='/my_jobs'
          }, 2000);
        }
      } catch (err){
        toastManager.value.alertError(err.response.data.messages)
        console.log(err.response.data.messages)
      }
      
    }

    return {
      title ,description ,skills ,selectedSize,selectedLevel, budjet, time,files ,onSubmit 
    };
  },
};
