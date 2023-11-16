import RestUserSession from "@/libs/RestUserSession";
import UserSessionRepository from "@/libs/UserSessionRepository";
import axios from "axios";
import { inject, ref } from "vue";

export default {
    setup(){
        let toastManager = inject("toastManager");
        const isLoading = ref(false);
        const restUserSession = new RestUserSession(axios);
        const userSessionRepository = new UserSessionRepository(localStorage);
        
        const email = ref('');
        const password = ref('');

        const handleErrorMessage = (error) => {
            toastManager.value.alertError(error);
        }

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
                    toastManager.value.alertSuccess("Sign in successfuly.");
                    setTimeout(() => {
                        location.href = "/";
                    }, 3000);
                }
            }).catch(error => {
                isLoading.value = false;
                console.log(error);
                handleErrorMessage('Bad credentials');
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