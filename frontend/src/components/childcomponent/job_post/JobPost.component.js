import { ref ,inject  ,defineComponent ,onMounted} from 'vue';
import RestClientJobs from "@/libs/RestClientJobs";
import UserSessionRepository from "@/libs/UserSessionRepository";

export default {
    props: {
        job: Object,
        colors: Object,
    },
    setup({ job},{ emit }){
        const axios = inject('axios');
        let account_type = ref(null);

        const userSessionRepository = new UserSessionRepository(localStorage);

        onMounted(async () => {
            console.log("job: " +job)
            account_type.value = await userSessionRepository.getAccountType();
        });
        const menuValue = ref(false)
        function menu(){
            menuValue.value=!menuValue.value
        }
        const  deleteJob = async() =>{
            let restClientJobs = new RestClientJobs(axios)
            let response = await  restClientJobs.delete(job.id)
            emit('remove-job', job.id);        
        }
        return { job, menu, menuValue, deleteJob, account_type}
    }
}
