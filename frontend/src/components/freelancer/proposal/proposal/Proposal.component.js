import { ref ,inject ,onMounted} from 'vue';
import RestClientJobs from '@/libs/RestClientJobs'
import RestProposals from '@/libs/RestProposals'
export default {
    props: {
        proposal: Object,
        status: 'pending' | 'active' | 'done' 
    },
    components: {
    },
    setup({proposal},  { emit }){
        const axios = inject('axios');
        let account_type = ref(null);
        const client = ref(null);
        const restJob = new  RestClientJobs(axios)
        const isTruncated = ref(true)
        const isLoading = ref(false);
        const restClientProposals = new RestProposals(axios)
        const user_id = ref(null)

        const getJobPost = async ()  =>  {
            let response = await restJob.getById(proposal.job_post_id)
            if(response.data){
                proposal.job_title = response.data.title
                user_id.value = response.data.user_id
                console.log(user_id)
            }
        }

        
        const getClient = async ()  =>  {
            console.log(user_id.value)
            let response = await restClientProposals.getUserInfo(user_id.value)
            if(response.data){
                proposal.client_image = response.data.username
                client.value = response.data
            }
        }

        const getFirstLetter = (name) => {
            if (name && typeof name === 'string') {
                return name.charAt(0);
            }
            return '';
        }

        onMounted( async() => {
            await getJobPost(); 
            await getClient(); 
        });

        if (proposal.created_at) {
            let [date, time] = proposal.created_at.split("T");
            proposal.created_day = date;
            proposal.created_time = time.split("Z")[0];
            delete proposal.created_at;
        }if (proposal.started_at) {
            let [date, time] = proposal.started_at.split(" ");
            proposal.started_day = date;
            proposal.started_time = time
            delete proposal.started_at;
        } else {
            console.error('created_at is undefined for a proposal:', proposal);
        }

        if(proposal.ends_at) {
            let [date, time] = proposal.ends_at.split(" ");
            proposal.ends_day = date;
            proposal.ends_time = time
        }

        const toggleTruncate = () => {
            isTruncated.value = !isTruncated.value;
        }
        
        return {   toggleTruncate, isTruncated, account_type, proposal, getFirstLetter, client, isLoading}
    }
}
