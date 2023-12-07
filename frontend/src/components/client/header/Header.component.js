import logo from '@/assets/images/logo.png';
import {ref} from 'vue'
export default {
    setup(){
        let isShow = ref(false)
        let isShow2 = ref(false)

        return { logo ,isShow ,isShow2}
    }
}
