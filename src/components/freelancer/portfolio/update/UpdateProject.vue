<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <div class="w-11/12 flex flex-col items-center">
            <FreeLancerHeaderVue target="portfolio" />
        </div>

        <Loading v-if="isLoadingProject" />

        <div v-else-if="projectNotFound" class="w-11/12 flex flex-col items-center justify-center py-24 text-center">
            <h2 class="text-xl font-bold text-gray-700">Project Not Found</h2>
            <p class="text-gray-500 mt-2">The requested project could not be found.</p>
            <router-link to="/portfolio" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90">
                Back to My Projects
            </router-link>
        </div>

        <div v-else class="w-11/12 flex flex-col gap-12 pb-16">
            <div class="w-full flex items-center justify-between">
                <div class="flex flex-col gap-2">
                    <div class="font-semibold text-2xl">Edit Project</div>
                    <div class="text-base text-gray-400">Update your project portfolio details and images</div>
                </div>
                <router-link
                    :to="`/project/${projectId}`"
                    class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                    View Project Preview
                </router-link>
            </div>

            <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-8">
                <div class="w-full flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm">
                    <!-- Title -->
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Title</div>
                            <div class="text-base text-gray-400">Give your project a clear and specific title.</div>
                        </div>
                        <div class="w-5/6">
                            <input
                                v-model="projectForm.title"
                                type="text"
                                placeholder="Enter Title"
                                :onfocus="() => projectFormErrors.title = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${projectFormErrors.title ? 'border-red-600' : 'border-gray-300'}`"
                            >
                            <div class="text-red-600 text-sm mt-1">{{ projectFormErrors.title }}</div>
                        </div>
                    </div>

                    <!-- Images -->
                    <div class="w-full flex items-start gap-4 p-8 border-t border-gray-100">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Project Images</div>
                            <div class="text-base text-gray-400">Manage screenshots and sample deliverables.</div>
                        </div>
                        <div class="w-5/6 flex flex-col gap-6">
                            <input ref="thumbnailRef" hidden type="file" multiple accept="image/*" @change="onSelectImage">
                            <div
                                @dragenter.prevent
                                @dragover.prevent
                                @drop.prevent="onDropImage"
                                @click="selectImage"
                                class="w-full h-36 rounded-xl border-dashed border-2 border-gray-300 flex flex-col items-center justify-center text-gray-600 hover:border-primary/60 hover:bg-gray-50/50 transition duration-200 select-none cursor-pointer"
                            >
                                <Icon icon="solar:gallery-add-linear" class="text-3xl text-gray-400 mb-1" />
                                <span class="font-medium text-sm">Click to Select Images or Drop them here</span>
                                <span class="text-xs text-gray-400 mt-0.5">JPG, PNG, WEBP supported</span>
                            </div>

                            <!-- Image Previews Grid -->
                            <div v-if="allImagesPreview.length > 0" class="w-full grid grid-cols-4 gap-4">
                                <div
                                    v-for="(img, index) in allImagesPreview"
                                    :key="index"
                                    class="w-full border rounded-xl overflow-hidden relative group bg-gray-50 aspect-video shadow-sm"
                                >
                                    <img class="w-full h-full object-cover" :src="img.previewUrl" :alt="'Screenshot ' + (index + 1)">
                                    <button
                                        type="button"
                                        @click.stop="removeImage(index)"
                                        class="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full shadow transition cursor-pointer"
                                        title="Remove image"
                                    >
                                        <Icon icon="stash:times-duotone" class="text-lg" />
                                    </button>
                                    <span
                                        v-if="img.isExisting"
                                        class="absolute bottom-1 left-1 px-2 py-0.5 bg-black/60 text-white text-[10px] rounded font-medium"
                                    >
                                        Current
                                    </span>
                                    <span
                                        v-else
                                        class="absolute bottom-1 left-1 px-2 py-0.5 bg-primary/80 text-white text-[10px] rounded font-medium"
                                    >
                                        New
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="w-full flex items-start gap-4 p-8 border-t border-gray-100">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Description</div>
                            <div class="text-base text-gray-400">Explain what this project is and how you built it.</div>
                        </div>
                        <div class="w-5/6">
                            <textarea
                                v-model="projectForm.description"
                                rows="6"
                                placeholder="Enter a Description"
                                :onfocus="() => projectFormErrors.description = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${projectFormErrors.description ? 'border-red-600' : 'border-gray-300'}`"
                            ></textarea>
                            <div class="text-red-600 text-sm mt-1">{{ projectFormErrors.description }}</div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center justify-between gap-4">
                    <button
                        type="button"
                        @click="showDeleteConfirm = true"
                        class="px-6 py-2.5 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition flex items-center gap-2 cursor-pointer"
                    >
                        <Icon icon="solar:trash-bin-trash-bold" class="text-lg" />
                        <span>Delete Project</span>
                    </button>

                    <div class="flex items-center gap-4">
                        <router-link
                            to="/portfolio"
                            class="px-8 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition cursor-pointer"
                        >
                            Cancel
                        </router-link>

                        <div v-if="isSubmitting" class="flex items-center gap-2 px-8 py-2.5 bg-primary/20 text-primary rounded-xl font-semibold">
                            <LoadingSpinner class="w-5 h-5 text-primary" />
                            <div>Saving Changes...</div>
                        </div>

                        <button
                            type="submit"
                            v-else
                            class="px-10 py-2.5 text-center text-white font-semibold bg-primary rounded-xl cursor-pointer hover:bg-opacity-90 transition shadow-sm"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
                <div class="flex items-center gap-3 text-red-600">
                    <div class="p-3 bg-red-100 rounded-full">
                        <Icon icon="solar:trash-bin-trash-bold" class="text-2xl" />
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">Delete Project</h3>
                </div>
                <p class="text-sm text-gray-600">
                    Are you sure you want to permanently delete this project? This action cannot be undone.
                </p>
                <div class="flex items-center justify-end gap-3 mt-4">
                    <button
                        type="button"
                        @click="showDeleteConfirm = false"
                        :disabled="isDeleting"
                        class="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition text-sm cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        @click="handleDeleteProject"
                        :disabled="isDeleting"
                        class="px-5 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                        <LoadingSpinner v-if="isDeleting" class="w-4 h-4 text-white" />
                        <span>{{ isDeleting ? 'Deleting...' : 'Yes, Delete' }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerProjects from "@/libs/RestFreelancerProjects";
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import { computed, inject, onMounted, reactive, ref, type Ref } from "vue";
import { useRoute, useRouter } from 'vue-router';

interface ImageItem {
    isExisting: boolean;
    previewUrl: string;
    path?: string;
    file?: File;
}

const route = useRoute();
const router = useRouter();
const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>("toastManager");
const restFreelancerProjects = new RestFreelancerProjects(axios!);

const projectId = Number(route.params.id);
const isLoadingProject = ref(true);
const isSubmitting = ref(false);
const projectNotFound = ref(false);
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

const thumbnailRef = ref<HTMLInputElement>();
const imagesList = ref<ImageItem[]>([]);

const projectForm = reactive({
    title: "",
    description: "",
});

const projectFormErrors = reactive({
    title: "",
    description: "",
});

const allImagesPreview = computed(() => imagesList.value);

onMounted(async () => {
    try {
        const projRes = await restFreelancerProjects.getById(projectId);

        if (projRes.isSuccess() && projRes.value) {
            const project = projRes.value;
            projectForm.title = project.title || "";
            projectForm.description = project.description || "";

            if (project.images && project.images.length > 0) {
                imagesList.value = project.images.map(img => {
                    let preview = img.url || img.path;
                    if (preview && !preview.startsWith('http') && !preview.startsWith('/')) {
                        preview = `/${preview}`;
                    }
                    return {
                        isExisting: true,
                        previewUrl: preview,
                        path: img.path,
                    };
                });
            }
        } else {
            projectNotFound.value = true;
        }
    } catch (err: any) {
        console.error("Failed to load project for edit:", err);
        projectNotFound.value = true;
    } finally {
        isLoadingProject.value = false;
    }
});

const selectImage = () => {
    thumbnailRef.value?.click();
};

const onSelectImage = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                imagesList.value.push({
                    isExisting: false,
                    previewUrl: URL.createObjectURL(file),
                    file,
                });
            } else {
                toastManager?.value?.alertError(`Please select a valid image file (${file.name}).`);
            }
        }
    }
    target.value = "";
};

const onDropImage = (ev: DragEvent) => {
    const files = ev.dataTransfer?.files;
    if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                imagesList.value.push({
                    isExisting: false,
                    previewUrl: URL.createObjectURL(file),
                    file,
                });
            } else {
                toastManager?.value?.alertError(`Please drop a valid image file (${file.name}).`);
            }
        }
    }
};

const removeImage = (index: number) => {
    imagesList.value.splice(index, 1);
};

const onSubmit = async () => {
    projectFormErrors.title = "";
    projectFormErrors.description = "";

    if (!projectForm.title.trim()) {
        projectFormErrors.title = "Title is required.";
    }

    if (!projectForm.description.trim()) {
        projectFormErrors.description = "Description is required.";
    }

    const hasErrors = Object.values(projectFormErrors).some(err => err.length > 0);
    if (hasErrors) {
        return;
    }

    isSubmitting.value = true;
    try {
        const newFiles = imagesList.value
            .filter(item => !item.isExisting && item.file)
            .map(item => item.file!);

        let uploadedPaths: string[] = [];
        if (newFiles.length > 0) {
            const uploadRes = await restFreelancerProjects.uploadImages(newFiles);
            if (uploadRes.isSuccess()) {
                uploadedPaths = uploadRes.value!;
            } else {
                throw new Error(uploadRes.error || "Failed to upload images");
            }
        }

        const keptExistingPaths = imagesList.value
            .filter(item => item.isExisting && item.path)
            .map(item => item.path!);

        const allImagePaths = [...keptExistingPaths, ...uploadedPaths];

        const updateRes = await restFreelancerProjects.update(projectId, {
            title: projectForm.title,
            description: projectForm.description,
            images: allImagePaths,
        });

        if (updateRes.isSuccess()) {
            toastManager?.value?.alertSuccess('Project updated successfully!');
            router.push('/portfolio');
        } else {
            toastManager?.value?.alertError(updateRes.error || 'Failed to update project');
        }
    } catch (err: any) {
        console.error("Error updating project:", err);
        toastManager?.value?.alertError(err?.message || 'Failed to update project');
    } finally {
        isSubmitting.value = false;
    }
};

const handleDeleteProject = async () => {
    isDeleting.value = true;
    try {
        const res = await restFreelancerProjects.delete(projectId);
        if (res.isSuccess()) {
            toastManager?.value?.alertSuccess('Project deleted successfully!');
            router.push('/portfolio');
        } else {
            toastManager?.value?.alertError(res.error || 'Failed to delete project');
        }
    } catch (err: any) {
        console.error("Failed to delete project:", err);
        toastManager?.value?.alertError(err?.message || 'Failed to delete project');
    } finally {
        isDeleting.value = false;
        showDeleteConfirm.value = false;
    }
};
</script>
