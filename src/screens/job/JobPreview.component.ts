import { ClientSingleJobPostPreviewVue as ClientJobVue } from "@/components/client/jobs/preview";
import { FreeLancerJobPreviewVue as FreelancerJobVue } from "@/components/freelancer/job/preview";
import UserSessionRepository from "@/libs/UserSessionRepository";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: 'JobVue',
    components: { ClientJobVue, FreelancerJobVue },
    props: {},
    setup() {
        const userSessionRepository = new UserSessionRepository(localStorage);
        let account_type = ref<AccountType | null>(userSessionRepository.getAccountType());

        onMounted(async () => {
            if (!account_type.value) {
                account_type.value = await userSessionRepository.getAccountType();
            }
        });

        return { account_type };
    },
});
