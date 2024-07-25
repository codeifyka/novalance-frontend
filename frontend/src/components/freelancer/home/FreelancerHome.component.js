import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { JobPostVue } from '@/components/childcomponent/job_post';
import RestUserSession from '@/libs/RestUserSession';
import RestClientJobs from "@/libs/RestClientJobs";
import { inject, onMounted, ref } from 'vue';

export default {
    components: { FreeLancerHeaderVue , JobPostVue},
    setup(){

        const colors = ref({
            'text':'text-purple-700',
            'background':"bg-violet-50/60",
        })

        const axios = inject("axios");
        const restUserSession = new RestUserSession(axios);
        let user_info = ref({ user: { username: "undefined" }, services: 0, projects: 0, sells: 0 });

        let Jobs = ref([])
        let restClientJobs = new RestClientJobs(axios)
        const fetchData = async () => {
            try {
                const response = await restClientJobs.getAll();
                if (response.data) {
                Jobs.value = response.data;
                console.log(response.data)
                } else {
                console.log(response);
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        onMounted(async () => {
            user_info.value = (await restUserSession.getInfo()).data;
            fetchData()
        });

        return { user_info ,colors ,fetchData,Jobs};

    }
}
