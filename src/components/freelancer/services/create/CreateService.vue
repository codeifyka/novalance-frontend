<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <div class="w-11/12 flex flex-col items-center">
            <FreeLancerHeaderVue target="create_service" />
        </div>
        <div class="w-11/12 flex flex-col gap-12">
            <div class="w-full flex flex-col gap-2">
                <div class="font-semibold text-2xl">Create Service</div>
                <div class="text-base text-gray-400">Fill the details about your service</div>
            </div>
            <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-8">
                <div class="w-full flex flex-col border border-gray-200 rounded-xl">
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Title</div>
                            <div class="text-base text-gray-400">Give your service a clear and specific title.</div>
                        </div>
                        <div class="w-5/6">
                            <input v-model="createServiceForm.title" type="text" placeholder="Enter Title"
                                :onfocus="() => createServiceFormErrors.title = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${createServiceFormErrors.title ? 'border-red-600' : 'border-gray-500'}`">
                            <div class="text-red-600">{{ createServiceFormErrors.title }}</div>
                        </div>
                    </div>
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Category</div>
                            <div class="text-base text-gray-400">Select the service category.</div>
                        </div>
                        <div class="w-5/6">
                            <select v-model="createServiceForm.category"
                                :onfocus="() => createServiceFormErrors.category = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${createServiceFormErrors.category ? 'border-red-600' : 'border-gray-500'}`">
                                <option selected disabled value="">Select a Category</option>
                                <option v-for="c in categories" :value="c.name">{{ c.name }}</option>
                            </select>
                            <div class="text-red-600">{{ createServiceFormErrors.category }}</div>
                        </div>
                    </div>
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Add Thumbnail</div>
                            <div class="text-base text-gray-400">Thumbnail</div>
                        </div>
                        <div class="w-5/6 flex flex-col gap-8">
                            <input ref="thumbnailRef" hidden type="file" :onchange="onSelectImage">
                            <div @dragenter.prevent @dragover.prevent @drop.prevent="onDropImage" :onclick="selectImage"
                                class="w-full h-40 rounded-lg border-dashed border-2 border-gray-300 flex items-center justify-center text-gray-600 active:scale-105 duration-300 select-none cursor-pointer">
                                Click to Select Image Or Drop it here</div>
                            <div class="w-full grid grid-cols-3 gap-2">
                                <div class="w-full border rounded-lg relative" v-for="(image, index) in images">
                                    <img class="w-full object-contain aspect-video" :src="image">
                                    <div :onclick="() => removeImage(index)"
                                        class="text-red-500 cursor-pointer absolute top-2 right-2 active:scale-105 select-none">
                                        <Icon icon="stash:times-duotone" class="text-3xl" />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Price</div>
                            <div class="text-base text-gray-400">Set a budget or specify the payment for this job.</div>
                        </div>
                        <div class="w-5/6">
                            <input v-model="createServiceForm.price" type="number" placeholder="Enter a Price"
                                :onfocus="() => createServiceFormErrors.price = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${createServiceFormErrors.price ? 'border-red-600' : 'border-gray-500'}`">
                            <div class="text-red-600">{{ createServiceFormErrors.price }}</div>
                        </div>
                    </div>
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Description</div>
                            <div class="text-base text-gray-400">Explain the job details and what you're looking for.
                            </div>
                        </div>
                        <div class="w-5/6">
                            <textarea v-model="createServiceForm.description" rows="6" type="text"
                                placeholder="Enter a Description"
                                :onfocus="() => createServiceFormErrors.description = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${createServiceFormErrors.description ? 'border-red-600' : 'border-gray-500'}`"></textarea>
                            <div class="text-red-600">{{ createServiceFormErrors.description }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center justify-end">
                    <div v-if="isFormLoading" class="flex items-center gap-2">
                        <LoadingSpinner />
                        <div>Submiting...</div>
                    </div>
                    <button type="submit" v-if="!isFormLoading"
                        class="w-96 text-center text-white font-semibold py-2 bg-primary rounded-xl cursor-pointer hover:bg-purple select-none active:scale-105 duration-300">
                        Create</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestCategories from "@/libs/RestCategories";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import { inject, reactive, ref, type Ref } from "vue";

const axios = inject<AxiosInstance>('axios');
let toastManager = inject<Ref<ToastsManager>>("toastManager");

const thumbnailRef = ref<HTMLInputElement>();
const isFormLoading = ref(false);
const createServiceForm = reactive({
    title: "",
    category: "",
    price: 0,
    description: "",
});

const createServiceFormErrors = reactive({
    title: "",
    category: "",
    price: "",
    description: "",
    api: "",
});

const images = ref<string[]>([]);
const images_files = ref<File[]>([]);

const categories = ref<Category[]>([]);

const restCategories = new RestCategories(axios!);
let response = await restCategories.getAll();
if (response.isSuccess()) {
    categories.value = response.value!;
}

const onDropImage = (ev: DragEvent) => {
    const files = ev.dataTransfer?.files || [];

    if (files.length > 0) {
        images_files.value.push(...files);
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const blobUrl = URL.createObjectURL(file);
            images.value.push(blobUrl);
            console.log(images.value);
        } else {
            alert('Please drop a valid image file.');
        }
    }
}

const selectImage = () => {
    thumbnailRef.value?.click();
}

const onSelectImage = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
        images_files.value.push(...files);
        const file = files[0];
        if (file.type.startsWith('image/')) {
            const blobUrl = URL.createObjectURL(file);
            images.value.push(blobUrl);
        }
    }

    target.value = "";
}

const removeImage = (index: number) => {
    images_files.value.splice(index, 1);
    images.value.splice(index, 1);
}

const uploadImages = async (): Promise<string[]> => {
    if (images.value.length > 0) {
        const restFreelancerServices = new RestFreelancerServices(axios!);
        let response = await restFreelancerServices.uploadImages(images_files.value);
        if (response.isSuccess()) {
            return response.value!;
        }
    }

    return [];
}

const onSubmit = async () => {
    isFormLoading.value = true;

    if (createServiceForm.title.length == 0) {
        createServiceFormErrors.title = "Title is required.";
    }

    if (createServiceForm.description.length == 0) {
        createServiceFormErrors.description = "Description is required.";
    }

    if (createServiceForm.price == 0) {
        createServiceFormErrors.price = "Price must be greater than 0.";
    }

    if (createServiceForm.category.length == 0) {
        createServiceFormErrors.category = "Category is required.";
    }

    const isValidForm = Object.values(createServiceFormErrors).filter(item => item.length > 0).length == 0;
    alert(isValidForm);
    if (!isValidForm) {
        isFormLoading.value = false;
        return;
    }

    const restFreelancerServices = new RestFreelancerServices(axios!);
    const response = await restFreelancerServices.create({
        title: createServiceForm.title,
        description: createServiceForm.description,
        category: createServiceForm.category,
        images: await uploadImages(),
        price: createServiceForm.price,
    });

    if (response.isSuccess()) {
        toastManager?.value.alertSuccess('Service created successfuly');
        window.location.href = `/services`;
        console.log(response.value);
    } else {
        toastManager?.value.alertError('Something went wrong!');
        console.log(response);
    }

    isFormLoading.value = false;
}
</script>
