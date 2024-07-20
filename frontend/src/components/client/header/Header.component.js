import logo from '@/assets/images/logo.png';
import RestUserSession from "@/libs/RestUserSession";
import {ref,inject} from 'vue'
import axios from "axios";  
export default {
    props :{
        isHomePath: Boolean
    },
    setup(){
        let toastManager = inject("toastManager");
        let isShow = ref(false)
        let isShow2 = ref(false)
        const isLoading = ref(false);
        const restUserSession = new RestUserSession(axios);
        const handleErrorMessage = (error) => {
            toastManager.value.alertError(error);
        }
        const showMobileMenu = ref(false);

        function toggleMenu() {
            showMobileMenu.value = !showMobileMenu.value;
        }

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
        return { logo ,isShow ,isShow2 , logout, showMobileMenu, toggleMenu}
    }
}
