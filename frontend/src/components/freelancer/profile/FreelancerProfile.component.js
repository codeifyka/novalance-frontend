import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { ref } from 'vue';

export default {
    components: { FreeLancerHeaderVue },
    setup(){
        let user = ref({ first_name: "", last_name: "", username: "", email: "" });
        
        return { user };
    }
}
