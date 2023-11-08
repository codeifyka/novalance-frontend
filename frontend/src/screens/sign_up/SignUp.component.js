import RestUserSession from "@/libs/RestUserSession";
import axios from "axios";
import { ref } from "vue";

const styles = {
    container: "w-full h-screen flex flex-col items-center bg-gray-900",
    inner: "w-1/3 rounded-md p-8 my-auto",
    headTitle: "text-xl text-gray-50 font-semibold",
    form: "grid grid-rows-5 grid-cols-2 gap-2 my-10",
    long_input: "bg-transparent text-gray-300 font-semibold border-gray-500 placeholder:text-gray-500 border-b p-2 col-span-2 w-full mx-auto outline-none",
    input: "bg-transparent text-gray-300 font-semibold border-gray-500 placeholder:text-gray-500 border-b p-2 w-full mx-auto outline-none",
    signInBtn: "text-blue-500 hover:text-blue-600 cursor-pointer",
    signUpBtn: "px-16 py-2 uppercase text-gray-50 font-semibold rounded-full bg-blue-600 hover:bg-blue-700 cursor-pointer  w-fit mx-auto",
};

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
            styles,
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