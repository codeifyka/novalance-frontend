import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import { inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
    components: { FreeLancerHeaderVue },
    setup(){
        let route = useRoute();
        let projects = ref([]);
        
        const axios = inject('axios');
        const restFreelancerProjects = new RestFreelancerProjects(axios);

        onMounted(async () => {
            let response = await restFreelancerProjects.getAll(route.params.username);
            console.log(response);
            if(response.data){
                projects.value = response.data;
            }
        });

        return {
            projects
        }
    }
}
