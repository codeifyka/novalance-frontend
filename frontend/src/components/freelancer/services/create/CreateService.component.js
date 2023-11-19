import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestCategories from "@/libs/RestCategories";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { inject, onMounted, ref } from "vue";

export default {
    components: { FreeLancerHeaderVue },
    setup(){
        const axios = inject('axios');
        let toastManager = inject("toastManager");

        const title = ref('');
        const description = ref('');
        const category = ref('');
        const price = ref(0);
        const images = ref([]);
        const images_files = ref([]);

        const categories = ref([]);

        onMounted(async () => {
            const restCategories = new RestCategories(axios);
            let response = await restCategories.getAll();
            if(response.data){
                categories.value = response.data;
            }
        });

        const onDropImage = (ev) => {
            const files = ev.dataTransfer.files;

            if (files.length > 0) {
                images_files.value.push(...files);
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    const blobUrl = URL.createObjectURL(file);
                    console.log({blobUrl});
                    images.value.push(blobUrl);
                    console.log(images.value);
                } else {
                    alert('Please drop a valid image file.');
                }
            }
        }

        const uploadImages = async () => {
            if(images.value.length > 0){
                const restFreelancerServices = new RestFreelancerServices(axios);
                let response = await restFreelancerServices.uploadImages(images_files.value);
                if(response.data){
                    return response.data;
                }
            }

            return null;
        }   

        const onSubmit = async () => {
            const restFreelancerServices = new RestFreelancerServices(axios);

            let response = await restFreelancerServices.create({
                title: title.value,
                description: description.value,
                category: category.value,
                images: await uploadImages(),
                price: price.value 
            });

            if(response.data){
                toastManager.value.alertSuccess('Service created successfuly');
                window.location.href = `/services`;
                console.log(response.data);
            }else{
                toastManager.value.alertError('Something went wrong!');
                console.log(response);
            }
        }

        return {
            title,
            description,
            category,
            price,
            images,
            categories,
            onDropImage,
            onSubmit
        };
    }
}
