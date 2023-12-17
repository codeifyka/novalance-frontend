import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import RestCategories from "@/libs/RestCategories";
import RestClientJobs from "@/libs/RestClientJobs";
import {ref , inject,onMounted} from 'vue'
export default {
  components: { ClientHeaderVue , ClientFooterVue  },
  setup() {   
    const axios = inject('axios');
    // Data
    const title = ref('')
    const description = ref('')
    const skills = ref([])
    const selectedSize = ref('')
    const selectedLevel = ref('')
    const budjet = ref('')
    const time = ref('')
    const files = ref('file.pdf')
    let toastManager = inject("toastManager");
    let restCategories = new RestCategories(axios)
    
    let onSubmit = async() =>{
      try {
        let restClientJobs = new RestClientJobs(axios)
        let response = await  restClientJobs.create({
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
          toastManager.value.alertSuccess('Job post created successfuly');
          setTimeout(() => {
            window.location.href='/my_jobs'
          }, 2000);
        }
      } catch (err){
        toastManager.value.alertError(err.response.data.messages)
        // let messages = err.response.data.messages;
        // let Props = Object.getOwnPropertyNames(messages)
        // console.log(Props)
        console.log(err)
      } 
    }
    
    let categories = ref([])

    onMounted(async () => {
      let response = await restCategories.getAll();
      console.log(response);
      if(response.data){
          categories.value = response.data;
      }
    });

    function addSkill(ev){
      let newSkill = ev.srcElement.value
      const foundObject = skills.value.find(obj => obj.name === newSkill);
      if( foundObject){
        skills.value = skills.value.filter(skill => skill !== foundObject);
      }else{
        skills.value.push({name:newSkill,value:true})
      }
    }

    return {
      title ,description ,skills ,selectedSize,selectedLevel, budjet, time,files ,onSubmit ,categories ,addSkill
    };
  },
};
