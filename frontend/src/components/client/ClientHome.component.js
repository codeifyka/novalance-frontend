import backgroundImage from '@/assets/bg_client.png';
import logo from '@/assets/images/logo.png';
import RestUserSession from "@/libs/RestUserSession";
import {ref,inject,computed} from 'vue'
import axios from "axios";  

export default {
  setup() {
    
    let isShow = ref(false)
    let isShow2 = ref(false)
    let title = ref('')
    const path = computed(() => ({ path: '/all_services', query: { 'title': title.value } }));
    const isLoading = ref(false);
    const restUserSession = new RestUserSession(axios);
    const handleErrorMessage = (error) => {
        toastManager.value.alertError(error);
    }
    let toastManager = inject("toastManager");

    const logout = () => {
      isLoading.value = true;
      restUserSession.logout().then(response => {
          isLoading.value = false;
          console.log(response);
          if(response.message){
              location.href = "/";
          }
      }).catch(error => {
          isLoading.value = false;
          console.log(error);
          handleErrorMessage('Bad credentials');
      });
    }
    return {
      backgroundImagePath: backgroundImage,logo,isShow,isShow2 , path, title,logout
    };
  },
};
