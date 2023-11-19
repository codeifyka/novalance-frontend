import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import { inject, ref } from "vue";

export default {
    components: { FreeLancerHeaderVue },
    setup(){
        const axios = inject('axios');
        let toastManager = inject("toastManager");

        const title = ref('');
        const description = ref('');
        const images = ref([]);
        const images_files = ref([]);

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
                const restFreelancerProjects = new RestFreelancerProjects(axios);
                let response = await restFreelancerProjects.uploadImages(images_files.value);
                if(response.data){
                    return response.data;
                }
            }

            return null;
        }   

        const onSubmit = async () => {
            const restFreelancerProjects = new RestFreelancerProjects(axios);

            let response = await restFreelancerProjects.create({
                title: title.value,
                description: description.value,
                images: await uploadImages(),
            });

            if(response.data){
                toastManager.value.alertSuccess('Service created successfuly');
                window.location.href = `/portfolio`;
                console.log(response.data);
            }else{
                toastManager.value.alertError('Something went wrong!');
                console.log(response);
            }
        }

        return {
            title,
            description,
            images,
            onDropImage,
            onSubmit
        };
    }
}
