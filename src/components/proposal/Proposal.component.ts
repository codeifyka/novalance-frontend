import { computed, ref, inject, onMounted, defineComponent, type Ref } from 'vue';
import RestClientJobs from '@/libs/RestClientJobs'
import RestProposals from '@/libs/RestProposals';
import { ModalVue } from './modal';
import type { AxiosInstance } from 'axios';
import type ToastsManager from '@/libs/ToastsManager';
import moment from 'moment';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';

export default defineComponent({
    props: {
        proposal: {
            type: Object as () => Proposal,
            required: true
        },
        status: {
            type: String as () => ProposalStatus,
            required: true
        },
        background: {
            type: String,
            required: false
        },
    },
    components: {
        ModalVue,
    },

    setup({ proposal }, { emit }) {
        const axios = inject<AxiosInstance>('axios');
        let toastManager = inject<Ref<ToastsManager>>("toastManager");
        let account_type = ref(null);
        const restJob = new RestClientJobs(axios!)
        const restClientProposals = new RestProposals(axios!)
        const isModalOpen = ref(false);
        const isTruncated = ref(true)
        const isLoading = ref(false);
        const menuValue = ref(false)
        const jobPost = ref<JobPost | null>(null);
        const freelancer = ref<User | null>(null);
        const dateSent = ref<string>("");
        const startedAtDay = ref<string>("");
        const startedAtTime = ref<string>("");
        const endedAtDay = ref<string>("");
        const endedAtTime = ref<string>("");

        const getJobPost = async () => {
            let response = await restJob.getById(proposal.job_post_id)
            if (response.isSuccess()) {
                jobPost.value = response.value!;
            }
        }

        const getFreelancer = async () => {
            let response = await restClientProposals.getUserInfo(proposal.freelancer_id)
            if (response.isSuccess()) {
                freelancer.value = response.value!;
            }
        }

        const freelancerName = computed(() => {
            const f = freelancer.value;
            if (!f) return 'Freelancer';
            const fullName = [f.first_name, f.last_name].filter(Boolean).join(' ').trim();
            return fullName || f.username || 'Freelancer';
        });

        const getFirstLetter = (name: string) => {
            if (name && typeof name === 'string') {
                return name.charAt(0);
            }
            return '';
        }

        const openModal = () => {
            isModalOpen.value = true;
        }
console.log(proposal)
        onMounted(() => {
            getJobPost()
            getFreelancer()
        });

        function menu() {
            menuValue.value = !menuValue.value
        }

        if (proposal.created_at) {
            dateSent.value = moment.utc(proposal.created_at).format('DD MMM YYYY · HH:mm');
        }

        if (proposal.started_at) {
            let [date, time] = proposal.started_at.split(" ");
            startedAtDay.value = date;
            startedAtTime.value = time
        }

        if (proposal.ends_at) {
            let [date, time] = proposal.ends_at.split(" ");
            endedAtDay.value = date;
            endedAtTime.value = time
        }

        const toggleTruncate = () => {
            isTruncated.value = !isTruncated.value;
        }

        const acceptProposal = async () => {
            try {
                isLoading.value = true
                const response = await restClientProposals.acceptProposal(proposal.id)
                if (response) {
                    toastManager?.value.alertSuccess("Accept proposal successfuly. Now you can send message to freelancer");
                    emit('proposalAccepted', proposal.id);
                    isLoading.value = false
                }
            } catch (err) {
                isLoading.value = false;
                console.log(err);
            }
        }

        // FIXME: Missing implementaion on Backend
        const deleteProposal = () => {
            alert("Not Implemented");
            // try {
            //     isLoading.value = true
            //     const response = restClientProposals.deleteProposal(proposal.id)
            //     if (response.data) {
            //         toastManager?.value.alertSuccess("Delete proposal successfuly. Now you can send message to freelancer");
            //         emit('proposalDeleted', proposal.id);
            //         isLoading.value = false
            //     }
            // } catch (err) {
            //     isLoading.value = false;
            //     console.log(err);
            // }
        }

        return {
            menu, menuValue,
            toggleTruncate,
            isTruncated,
            account_type,
            proposal,
            getFirstLetter,
            isModalOpen,
            openModal,
            freelancer,
            freelancerName,
            DEFAULT_PROFILE_PICTURE,
            acceptProposal,
            isLoading,
            deleteProposal,
            dateSent,
            startedAtDay,
            startedAtTime,
            endedAtDay,
            endedAtTime,
            jobPost
        };

    }
});
