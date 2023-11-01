import RestInfo from "@/libs/RestInfo";
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: 'HomeVue',
    props: {},
    setup() {
        let data = ref(null);

        const restInfo = new RestInfo(axios);

        onMounted(async () => {
            data.value = await restInfo.getInfo();
        });

        return { data };
    },
});
