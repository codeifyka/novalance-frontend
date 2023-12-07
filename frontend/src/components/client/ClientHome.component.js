import backgroundImage from '@/assets/bg_client.png';
import logo from '@/assets/images/logo.png';
import {ref} from 'vue'

export default {
  setup() {
    
    let isShow = ref(false)
    let isShow2 = ref(false)

    return {
      backgroundImagePath: backgroundImage,logo,isShow,isShow2
    };
  },
};
