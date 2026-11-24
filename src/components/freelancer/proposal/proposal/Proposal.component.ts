import { computed, ref, inject, onMounted, defineComponent } from 'vue';
import RestClientJobs from '@/libs/RestClientJobs'
import RestProposals from '@/libs/RestProposals'
import { ModalVue, ClientModalVue } from './modal';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import type { AxiosInstance } from 'axios';
import Utils from '@/libs/Utils';

export default defineComponent({
    props: {
        proposal: {
            type: Object as () => Proposal,
            required: true
        },
        status: {
            type: String as () => ProposalStatus,
        }
    },
    components: {
        ModalVue,
        ClientModalVue,
    },
    setup({ proposal }) {
        const axios = inject<AxiosInstance>('axios');
        let account_type = ref(null);
        const client = ref<User | null>(null);
        const restJob = new RestClientJobs(axios!)
        const isTruncated = ref(true)
        const isLoading = ref(false);
        const restClientProposals = new RestProposals(axios!)
        const user_id = ref(0);
        const jobTitle = ref("");
        const isModalOpen = ref(false);
        const clientName = computed(() => {
            const c = client.value;
            if (!c) return 'Client';
            const fullName = [c.first_name, c.last_name].filter(Boolean).join(' ').trim();
            return fullName || c.username || 'Client';
        });

        const dateSent = ref<string>("");
        const startedAtDay = ref<string>("");
        const startedAtTime = ref<string>("");
        const endedAtDay = ref<string>("");
        const endedAtTime = ref<string>("");

        const isLoadingClient = ref(true);

        const getJobPost = async () => {
            let response = await restJob.getById(proposal.job_post_id)
            if (response.isSuccess()) {
                jobTitle.value = response.value!.title
                user_id.value = response.value!.user_id
                console.log(user_id)
            }
        }


        const getClient = async () => {
            console.log(user_id.value)
            let response = await restClientProposals.getUserInfo(user_id.value)
            if (response.isSuccess()) {
                client.value = response.value!
                isLoadingClient.value = false;
            } else {
                isLoadingClient.value = false;
                console.error('Failed to load client info');
            }
        }

        const getFirstLetter = (name: string) => {
            if (name && typeof name === 'string') {
                return name.charAt(0);
            }
            return '';
        }

        const openModal = () => {
            if (isLoadingClient.value || !client.value) return;
            isModalOpen.value = true;
        }

        onMounted(async () => {
            await getJobPost();
            await getClient();
        });

        if (proposal.created_at) {
            dateSent.value = Utils.formatDateTime(proposal.created_at);
        }

        if (proposal.started_at) {
            const [date, time] = Utils.splitDateTime(proposal.started_at);
            startedAtDay.value = date;
            startedAtTime.value = time;
        }

        if (proposal.ends_at) {
            const [date, time] = Utils.splitDateTime(proposal.ends_at);
            endedAtDay.value = date;
            endedAtTime.value = time;
        }

        const toggleTruncate = () => {
            isTruncated.value = !isTruncated.value;
        }

        return {
            toggleTruncate, isTruncated,
            account_type,
            proposal,
            getFirstLetter,
            client,
            clientName,
            DEFAULT_PROFILE_PICTURE,
            isModalOpen,
            openModal,
            isLoading,
            isLoadingClient,
            jobTitle,
            dateSent,
            startedAtDay,
            startedAtTime,
            endedAtDay,
            endedAtTime,
        }
    }
});
