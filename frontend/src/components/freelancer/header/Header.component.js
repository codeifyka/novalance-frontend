import { ref } from "vue";

export default {
    props: {
        target: String,
    },
    setup(props){
        const showMobileMenu = ref(false);

        function toggleMenu() {
            showMobileMenu.value = !showMobileMenu.value;
        }

        return {
            target: props.target,
            showMobileMenu,
            toggleMenu
        }
    }
}
