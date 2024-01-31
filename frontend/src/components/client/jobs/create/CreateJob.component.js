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
    let title = ref('')
    let description = ref('')
    let skills = ref([])
    let selectedSize = ref('')
    let selectedLevel = ref('')
    let budjet = ref('')
    let time = ref('')
    let files = ref('')
    let categories = ref([])

    let toastManager = inject("toastManager");
    let restCategories = new RestCategories(axios)

    onMounted(async () => {
      let response = await restCategories.getAll();
      console.log(response);
      if(response.data){
          categories.value = response.data;
      }
    });

    let onSubmit = async() =>{
      try {
        let restClientJobs = new RestClientJobs(axios)
        let formData = new FormData();
        formData.append('files', files.value);
        formData.append('title', title.value);
        formData.append('description', description.value);
        formData.append('skills', JSON.stringify(skills.value));
        formData.append('level', selectedLevel.value);
        formData.append('size', selectedSize.value);
        formData.append('budjet', budjet.value);
        formData.append('time', time.value);
        formData.append('expected_delivery_time', time.value);

        let response = await  restClientJobs.create(formData);
        if(response.data){
          console.log(response.data)
          toastManager.value.alertSuccess('Job post created successfuly');
          setTimeout(() => {
            // window.location.href='/my_jobs'
          }, 2000);
        }
      } catch (err){
        toastManager.value.alertError(err.response)
        // let messages = err.response.data.messages;
        console.log(err)
      } 
    }
    
    function handleFileChange(event){
      files.value = event.target.files[0]
    }

    const uploadImages = async () => {
      if(files.value.length > 0){
          const restClientJobs = new RestClientJobs(axios);
          let response = await restClientJobs.uploadFiles(files.value);
          if(response.data){
              return response.data;
          }
      }

      return null;
  } 
  

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
      title ,
      description ,
      skills ,
      selectedSize,
      selectedLevel, 
      budjet, 
      time,
      files ,
      onSubmit ,
      categories ,
      addSkill,
      handleFileChange,
    };
  },
};
