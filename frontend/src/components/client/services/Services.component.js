import { ClientHeaderVue } from '@/components/client/header';
import { ClientFooterVue } from '@/components/client/footer';
import { inject, onMounted, ref } from "vue";

export default {
  components: { ClientHeaderVue , ClientFooterVue  },
  setup() {   
    
    let services= ref([
              {
                id : 1 , 
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              } ,
              {
                id : 2 ,
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              },
              {
                id : 3 ,
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              },
              {
                id : 4 ,
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              },
              {
                id : 5,
                title : "title",
                category : "category" ,
                price : 200 , 
                rate : 3
              },
              {
                id : 6 ,
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
