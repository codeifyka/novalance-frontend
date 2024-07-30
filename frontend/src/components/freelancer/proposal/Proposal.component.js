import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { inject, onMounted, ref } from 'vue';
import { DoneVue } from './done';
import { PendingVue } from './pending';
import { ActiveVue } from './active';
import RestProposals from '@/libs/RestProposals';

export default {
    components: { FreeLancerHeaderVue, DoneVue, PendingVue, ActiveVue },
    setup(){
        const axios = inject("axios");
        const toastManager = inject("toastManager");
        const isLoading = ref(false);
        const status = ref('active');
        const restClientProposals = new RestProposals(axios);
        const pendingProposals = ref([])
        const doneProposals = ref([])
        const activeProposals = ref([])
    
        onMounted(async () => {
            let response = await restClientProposals.getFreelancerProposals();
            if(response){
                pendingProposals.value = response.filter(p=> p.status === 'pending');
                doneProposals.value = response.filter(p=> p.status === 'done');
                activeProposals.value = response.filter(p=> p.status === 'active');
            }
        });
        const changeSection = (statusValue) => {
            status.value = statusValue;
        };

        return { 
            isLoading, changeSection, pendingProposals, doneProposals, activeProposals, status
        };
    }
}
