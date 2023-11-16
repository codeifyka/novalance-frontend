import RestUserSession from "@/libs/RestUserSession";
import UserSessionRepository from "@/libs/UserSessionRepository";
import axios from "axios";
import { ref } from "vue";

export default {
    setup(){
        const isLoading = ref(false);
        const restUserSession = new RestUserSession(axios);
        const userSessionRepository = new UserSessionRepository(localStorage);
        
        const email = ref('');
        const password = ref('');

        const signIn = () => {
            isLoading.value = true;
            restUserSession.login({ 
                email: email.value,
                password: password.value
            }).then(response => {
                isLoading.value = false;
                console.log(response);
                if(response.access_token){
                    userSessionRepository.save({ access_token: response.access_token, account_type: response.account_type });
                    location.href = "/";
                }
            }).catch(error => {
                isLoading.value = false;
                console.log(error);
                alert('Bad credentials');
            });
        }

        return {
            email,
            password,
            signIn,
            isLoading
        };
    }
}