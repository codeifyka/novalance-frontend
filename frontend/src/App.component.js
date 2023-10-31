import { defineComponent } from "vue";
import { HomeVue } from '@/screens/freelancer/home/index';

export default defineComponent({
    name: 'AppVue',
    components: { HomeVue },
    props: {},
    setup() {
        return { };
    },
});
