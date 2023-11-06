import RestUserSession from "@/libs/RestUserSession";
import axios from "axios";
import { ref } from "vue";

export default {
    setup(){
        const restUserSession = new RestUserSession(axios);

        const username = ref('');
        const first_name = ref('');
        const last_name = ref('');
        const email = ref('');
        const account_type = ref('freelancer');
        const password = ref('');
        const confirm_password = ref('');

        const signUp = () => {
            restUserSession.register({
                username: username.value,
                first_name: first_name.value, 
                last_name: last_name.value, 
                account_type: account_type.value, 
                email: email.value,
                password: password.value,
                confirm_password: confirm_password.value,
            }).then(response => {
                console.log(response);
                if(response.error){
                    alert(JSON.stringify(response.data));
                }else{
                    // location.href = "/sign_in";
                }
            }).catch(error => {
                console.log(error);
                alert('Bad credentials');
            });
        }

        return {
            username,
            first_name,
            last_name,
            email,
            account_type,
            password,
            confirm_password,
            signUp,
        };
    }
}