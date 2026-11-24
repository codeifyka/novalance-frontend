import { FreeLancerHomeVue } from "@/components/freelancer/home";
import UserSessionRepository from "@/libs/UserSessionRepository";
import { defineComponent, onMounted, ref } from "vue";
import { ClientHomeVue } from '@/components/client';
import { useRouter } from "vue-router";

export default defineComponent({
    name: 'HomeVue',
    components: { FreeLancerHomeVue, ClientHomeVue },
    props: {},
    setup() {
        let account_type = ref<AccountType | null>(null);
        const router = useRouter();
        const userSessionRepository = new UserSessionRepository(localStorage);

        onMounted(async () => {
            account_type.value = await userSessionRepository.getAccountType();
            if (account_type.value === 'admin') {
                router.replace('/admin');
            }
        });

        return { account_type };
    },
});
