import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import { inject, onMounted, ref } from "vue";

export default {
  components: { ClientHeaderVue , ClientFooterVue  },
  setup() {   
    
    let services= ref([
              {
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              } ,
              {
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              },
              {
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              },
              {
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              }
      ])
    return {
    services ,
    };
  },
};
