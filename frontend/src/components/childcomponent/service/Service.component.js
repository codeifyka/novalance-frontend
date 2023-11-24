import { ref, defineProps } from 'vue';
export default {
    props: {
        service: Object, // Define the service prop as an object type
    },
    setup(props){
        const service = props.service;

        return { service }
    }
}
