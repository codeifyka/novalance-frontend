<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <div class="w-11/12 flex flex-col items-center">
            <FreeLancerHeaderVue target="create_service" />
        </div>
        <div class="w-11/12 flex flex-col gap-12">
            <div class="w-full flex flex-col gap-2">
                <div class="font-semibold text-2xl">Add New Project</div>
                <div class="text-base text-gray-400">Fill the details about your project</div>
            </div>
            <form @keydown.enter.prevent @submit.prevent="onSubmit" class="w-full flex flex-col gap-8">
                <div class="w-full flex flex-col border border-gray-200 rounded-xl">
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Title</div>
                            <div class="text-base text-gray-400">Give your project a clear and specific title.</div>
                        </div>
                        <div class="w-5/6">
                            <input v-model="createProjectForm.title" type="text" placeholder="Enter Title"
                                :onfocus="() => createProjectFormErrors.title = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${createProjectFormErrors.title ? 'border-red-600' : 'border-gray-500'}`">
                            <div class="text-red-600">{{ createProjectFormErrors.title }}</div>
                        </div>
                    </div>
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Add Skills</div>
                            <div class="text-base text-gray-400">List the skills needed to complete this job.</div>
                        </div>
                        <div class="w-5/6 flex flex-col gap-2">
                            <input v-model="skill" @keydown.enter="addSkill" type="text" placeholder="Type a Skill"
                                :onfocus="() => createProjectFormErrors.skills = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${createProjectFormErrors.skills ? 'border-red-600' : 'border-gray-500'}`">
                            <div class="text-red-600">{{ createProjectFormErrors.skills }}</div>
                            <div class="w-full flex items-center flex-wrap gap-2">
                                <div v-for="(skill, index) in createProjectForm.skills"
                                    class="w-fit flex items-center py-1 px-4 bg-gray-100 rounded-full">
                                    <div>{{ skill }}</div>
                                    <div @click="() => removeSkill(index)"
                                        class="cursor-pointer duration-300 active:scale-105 select-none">
                                        <Icon icon="stash:times-duotone" class="text-2xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Add Images</div>
                            <div class="text-base text-gray-400">Show your project</div>
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
                            <div class="text-base font-semibold">Description</div>
                            <div class="text-base text-gray-400">Explain the project details and what you're looking
                                for.</div>
                        </div>
                        <div class="w-5/6">
                            <textarea v-model="createProjectForm.description" rows="6" type="text"
                                placeholder="Enter a Description"
                                :onfocus="() => createProjectFormErrors.description = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${createProjectFormErrors.description ? 'border-red-600' : 'border-gray-500'}`"></textarea>
                            <div class="text-red-600">{{ createProjectFormErrors.description }}</div>
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
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import { inject, reactive, ref, type Ref } from "vue";

const axios = inject<AxiosInstance>('axios');
let toastManager = inject<Ref<ToastsManager>>("toastManager");

const images = ref<string[]>([]);
const images_files = ref<File[]>([]);
const thumbnailRef = ref<HTMLInputElement>();
const skill = ref("");
const isFormLoading = ref(false);
const createProjectForm = reactive<{ title: string; description: string; skills: string[]; }>({
    title: "",
    description: "",
    skills: [],
});

const createProjectFormErrors = reactive({
    title: "",
    description: "",
    skills: "",
    api: "",
});


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
        const restFreelancerProjects = new RestFreelancerProjects(axios!);
        let response = await restFreelancerProjects.uploadImages(images_files.value);
        if (response.isSuccess()) {
            return response.value!;
        }
    }

    return [];
}

const onSubmit = async () => {
    isFormLoading.value = true;

    if (createProjectForm.title.length == 0) {
        createProjectFormErrors.title = "Title is required.";
    }

    if (createProjectForm.description.length == 0) {
        createProjectFormErrors.description = "Description is required.";
    }

    const isValidForm = Object.values(createProjectFormErrors).filter(item => item.length > 0).length == 0;
    alert(isValidForm);
    if (!isValidForm) {
        isFormLoading.value = false;
        return;
    }

    const restFreelancerProjects = new RestFreelancerProjects(axios!);

    let response = await restFreelancerProjects.create({
        title: createProjectForm.title,
        description: createProjectForm.description,
        images: await uploadImages(),
    });

    if (response.isSuccess()) {
        toastManager?.value.alertSuccess('Service created successfuly');
        window.location.href = `/portfolio`;
        console.log(response.value);
    } else {
        toastManager?.value.alertError('Something went wrong!');
        console.log(response);
    }

    isFormLoading.value = false;
}

const addSkill = () => {
    createProjectForm.skills.push(skill.value);
    skill.value = "";
}

const removeSkill = (index: number) => {
    createProjectForm.skills.splice(index, 1);
}

</script>
