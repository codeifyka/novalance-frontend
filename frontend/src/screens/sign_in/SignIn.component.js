import RestUserSession from "@/libs/RestUserSession";
import UserSessionRepository from "@/libs/UserSessionRepository";
import axios from "axios";
import { ref } from "vue";

export default {
    setup(){
        const restUserSession = new RestUserSession(axios);
        const userSessionRepository = new UserSessionRepository(localStorage);
        
        const email = ref('');
        const password = ref('');

        const signIn = () => {
            restUserSession.login({ 
                email: email.value,
                password: password.value
            }).then(response => {
                console.log(response);
                if(response.access_token){
                    userSessionRepository.save({ access_token: response.access_token, account_type: response.account_type });
                    location.href = "/";
                }
            }).catch(error => {
                console.log(error);
                alert('Bad credentials');
            });
        }

        return {
            email,
            password,
            signIn,
        };
    }
}