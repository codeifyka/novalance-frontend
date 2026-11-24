import { computed, ref, inject, onMounted, defineComponent, type Ref } from 'vue';
import RestClientJobs from '@/libs/RestClientJobs';
import RestProposals from '@/libs/RestProposals';
import RestWallet from '@/libs/RestWallet';
import RestDisputes from '@/libs/RestDisputes';
import UserSessionRepository from '@/libs/UserSessionRepository';
import { ModalVue } from './modal';
import type { AxiosInstance } from 'axios';
import type ToastsManager from '@/libs/ToastsManager';
import Utils from '@/libs/Utils';
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
    emits: ['proposalAccepted', 'proposalCompleted', 'proposalDeleted'],

    setup({ proposal }, { emit }) {
        const axios = inject<AxiosInstance>('axios');
        const toastManager = inject<Ref<ToastsManager>>("toastManager");
        const userSessionRepo = new UserSessionRepository(localStorage);
        const account_type = ref<string | null>(null);

        const restJob = new RestClientJobs(axios!);
        const restClientProposals = new RestProposals(axios!);
        const restWallet = new RestWallet(axios!);
        const restDisputes = new RestDisputes(axios!);

        const isModalOpen = ref(false);
        const isTruncated = ref(true);
        const isLoading = ref(false);
        const menuValue = ref(false);
        const jobPost = ref<JobPost | null>(null);
        const freelancer = ref<User | null>(null);
        const dateSent = ref<string>("");
        const startedAtDay = ref<string>("");
        const startedAtTime = ref<string>("");
        const endedAtDay = ref<string>("");
        const endedAtTime = ref<string>("");

        // Contract Accept Modal State
        const isAcceptModalOpen = ref(false);
        const contractEndDate = ref<string>("");
        const clientWallet = ref<WalletSummary | null>(null);
        const isSubmittingAccept = ref(false);

        // Dispute Modal State
        const isDisputeModalOpen = ref(false);
        const disputeReason = ref<string>("");
        const isSubmittingDispute = ref(false);

        // Complete Modal State
        const isCompleteModalOpen = ref(false);
        const isSubmittingComplete = ref(false);

        const getJobPost = async () => {
            let response = await restJob.getById(proposal.job_post_id);
            if (response.isSuccess()) {
                jobPost.value = response.value!;
            }
        };

        const getFreelancer = async () => {
            let response = await restClientProposals.getUserInfo(proposal.freelancer_id);
            if (response.isSuccess()) {
                freelancer.value = response.value!;
            }
        };

        const freelancerName = computed(() => {
            const f = freelancer.value;
            if (!f) return 'Freelancer';
            const fullName = [f.first_name, f.last_name].filter(Boolean).join(' ').trim();
            return fullName || f.username || 'Freelancer';
        });

        const openModal = () => {
            isModalOpen.value = true;
        };

        const canDispute = computed(() => {
            if (!proposal.ends_at) return false;
            return new Date() >= new Date(proposal.ends_at);
        });

        const isEndDatePassed = computed(() => {
            if (!proposal.ends_at) return false;
            return new Date() >= new Date(proposal.ends_at);
        });

        onMounted(async () => {
            account_type.value = userSessionRepo.getAccountType();
            getJobPost();
            getFreelancer();

            // Default contract end date to 7 days from today
            const defaultEnd = new Date();
            defaultEnd.setDate(defaultEnd.getDate() + 7);
            contractEndDate.value = defaultEnd.toISOString().split('T')[0];
        });

        function menu() {
            menuValue.value = !menuValue.value;
        }

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
        };

        // Open Accept Modal
        const openAcceptModal = async () => {
            menuValue.value = false;
            try {
                const walletRes = await restWallet.getMyWallet();
                if (walletRes.isSuccess() && walletRes.value) {
                    clientWallet.value = walletRes.value;
                }
            } catch (err) {
                console.error("Failed to fetch wallet:", err);
            }
            isAcceptModalOpen.value = true;
        };

        // Confirm & Accept Proposal
        const confirmAcceptProposal = async () => {
            if (!contractEndDate.value) {
                toastManager?.value?.alertError?.("Please select a contract end date.");
                return;
            }

            try {
                isSubmittingAccept.value = true;
                const response = await restClientProposals.acceptProposal(proposal.id, contractEndDate.value);
                if (response.isSuccess()) {
                    toastManager?.value?.alertSuccess?.("Contract activated! Escrow locked successfully.");
                    emit('proposalAccepted', proposal.id);
                    isAcceptModalOpen.value = false;
                } else {
                    toastManager?.value?.alertError?.(response.error || "Failed to accept proposal.");
                }
            } catch (err: any) {
                const message = err.response?.data?.error || err.message || "Failed to accept proposal.";
                toastManager?.value?.alertError?.(message);
            } finally {
                isSubmittingAccept.value = false;
            }
        };

        // Complete Proposal (Release Escrow)
        const openCompleteModal = () => {
            isCompleteModalOpen.value = true;
        };

        const confirmCompleteProposal = async () => {
            try {
                isSubmittingComplete.value = true;
                const res = await restClientProposals.completeProposal(proposal.id);
                if (res.isSuccess()) {
                    toastManager?.value?.alertSuccess?.("Contract completed! Funds released to freelancer.");
                    proposal.status = 'done';
                    emit('proposalCompleted', proposal.id);
                    isCompleteModalOpen.value = false;
                } else {
                    toastManager?.value?.alertError?.(res.error || "Failed to complete proposal.");
                }
            } catch (err: any) {
                const message = err.response?.data?.error || err.message || "Failed to complete proposal.";
                toastManager?.value?.alertError?.(message);
            } finally {
                isSubmittingComplete.value = false;
            }
        };

        // Open Dispute Modal
        const openDisputeModal = () => {
            if (!canDispute.value) {
                const dateStr = proposal.ends_at ? Utils.formatDate(proposal.ends_at) : 'the scheduled end date';
                toastManager?.value?.alertError?.(`Disputes are only permitted after ${dateStr}.`);
                return;
            }
            disputeReason.value = "";
            isDisputeModalOpen.value = true;
        };

        // Submit Dispute
        const submitDispute = async () => {
            if (!disputeReason.value.trim()) {
                toastManager?.value?.alertError?.("Please explain the reason for the dispute.");
                return;
            }

            try {
                isSubmittingDispute.value = true;
                const res = await restDisputes.createDispute(proposal.id, disputeReason.value);
                if (res.isSuccess()) {
                    toastManager?.value?.alertSuccess?.("Dispute opened. Admin will review the chat and details.");
                    proposal.status = 'disputed';
                    isDisputeModalOpen.value = false;
                } else {
                    toastManager?.value?.alertError?.(res.error || "Failed to create dispute.");
                }
            } catch (err: any) {
                const message = err.response?.data?.error || err.message || "Failed to submit dispute.";
                toastManager?.value?.alertError?.(message);
            } finally {
                isSubmittingDispute.value = false;
            }
        };

        const deleteProposal = () => {
            alert("Not Implemented");
        };

        return {
            menu,
            menuValue,
            toggleTruncate,
            isTruncated,
            account_type,
            proposal,
            isModalOpen,
            openModal,
            freelancer,
            freelancerName,
            DEFAULT_PROFILE_PICTURE,
            isLoading,
            deleteProposal,
            dateSent,
            startedAtDay,
            startedAtTime,
            endedAtDay,
            endedAtTime,
            jobPost,
            // Modal states & actions
            isAcceptModalOpen,
            contractEndDate,
            clientWallet,
            isSubmittingAccept,
            openAcceptModal,
            confirmAcceptProposal,
            // Complete actions
            isCompleteModalOpen,
            isSubmittingComplete,
            openCompleteModal,
            confirmCompleteProposal,
            // Dispute actions
            isDisputeModalOpen,
            disputeReason,
            isSubmittingDispute,
            canDispute,
            isEndDatePassed,
            openDisputeModal,
            submitDispute,
        };
    }
});
