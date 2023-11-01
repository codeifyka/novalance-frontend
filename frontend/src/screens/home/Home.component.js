import { defineComponent, inject, onMounted, ref } from "vue";

export default defineComponent({
    name: 'HomeVue',
    props: {},
    setup() {
        let data = ref(null);
        const restInfo = inject('restInfo');

        onMounted(async () => {
            data.value = await restInfo.getInfo();
        });

        return { data };
    },
});
