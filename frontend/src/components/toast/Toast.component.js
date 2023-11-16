import { onMounted } from "vue"

export default {
    props: {
        toasts: Array,
    },
    setup(props){

        return {
            toasts: props.toasts
        }
    }
}
