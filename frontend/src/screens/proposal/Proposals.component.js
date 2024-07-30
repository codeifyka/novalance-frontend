import { ClientProposalVue } from "@/components/client/proposals";
import { FreelancerProposalVue } from "@/components/freelancer/proposal";
import UserSessionRepository from "@/libs/UserSessionRepository";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: 'ProposalVue',
    components: { ClientProposalVue, FreelancerProposalVue },
    props: {},
    setup() {
        let account_type = ref(null);

        const userSessionRepository = new UserSessionRepository(localStorage);

        onMounted(async () => {
            account_type.value = await userSessionRepository.getAccountType();
        });

        return { account_type };
    },
});
