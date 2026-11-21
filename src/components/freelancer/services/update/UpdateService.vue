<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center pt-24 md:pt-28 pb-4 gap-16">
        <div class="w-11/12 flex flex-col items-center">
            <FreeLancerHeaderVue target="services" />
        </div>

        <Loading v-if="isLoadingService" />

        <div v-else-if="serviceNotFound" class="w-11/12 flex flex-col items-center justify-center py-24 text-center">
            <h2 class="text-xl font-bold text-gray-700">Service Not Found</h2>
            <p class="text-gray-500 mt-2">The requested service could not be found.</p>
            <router-link to="/services" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90">
                Back to My Services
            </router-link>
        </div>

        <div v-else class="w-11/12 flex flex-col gap-12 pb-16">
            <div class="w-full flex items-center justify-between">
                <div class="flex flex-col gap-2">
                    <div class="font-semibold text-2xl">Edit Service</div>
                    <div class="text-base text-gray-400">Update your service details and images</div>
                </div>
                <router-link
                    :to="`/service/${serviceId}`"
                    class="px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
                >
                    View Service Preview
                </router-link>
            </div>

            <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-8">
                <div class="w-full flex flex-col border border-gray-200 rounded-xl bg-white shadow-sm">
                    <!-- Title -->
                    <div class="w-full flex items-start gap-4 p-8">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Title</div>
                            <div class="text-base text-gray-400">Give your service a clear and specific title.</div>
                        </div>
                        <div class="w-5/6">
                            <input
                                v-model="serviceForm.title"
                                type="text"
                                placeholder="Enter Title"
                                :onfocus="() => serviceFormErrors.title = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${serviceFormErrors.title ? 'border-red-600' : 'border-gray-300'}`"
                            >
                            <div class="text-red-600 text-sm mt-1">{{ serviceFormErrors.title }}</div>
                        </div>
                    </div>

                    <!-- Category -->
                    <div class="w-full flex items-start gap-4 p-8 border-t border-gray-100">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Category</div>
                            <div class="text-base text-gray-400">Select the service category.</div>
                        </div>
                        <div class="w-5/6">
                            <select
                                v-model="serviceForm.category"
                                :onfocus="() => serviceFormErrors.category = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${serviceFormErrors.category ? 'border-red-600' : 'border-gray-300'}`"
                            >
                                <option disabled value="">Select a Category</option>
                                <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
                            </select>
                            <div class="text-red-600 text-sm mt-1">{{ serviceFormErrors.category }}</div>
                        </div>
                    </div>

                    <!-- Images (Existing + New) -->
                    <div class="w-full flex items-start gap-4 p-8 border-t border-gray-100">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Service Images</div>
                            <div class="text-base text-gray-400">Manage thumbnails and project screenshots.</div>
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
                                    <img class="w-full h-full object-cover" :src="img.previewUrl" :alt="'Thumbnail ' + (index + 1)">
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

                    <!-- Price -->
                    <div class="w-full flex items-start gap-4 p-8 border-t border-gray-100">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Price ($ USD)</div>
                            <div class="text-base text-gray-400">Set the payment price for this service.</div>
                        </div>
                        <div class="w-5/6">
                            <input
                                v-model.number="serviceForm.price"
                                type="number"
                                min="1"
                                placeholder="Enter Price in USD"
                                :onfocus="() => serviceFormErrors.price = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${serviceFormErrors.price ? 'border-red-600' : 'border-gray-300'}`"
                            >
                            <div class="text-red-600 text-sm mt-1">{{ serviceFormErrors.price }}</div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="w-full flex items-start gap-4 p-8 border-t border-gray-100">
                        <div class="w-1/6 flex flex-col gap-4">
                            <div class="text-base font-semibold">Description</div>
                            <div class="text-base text-gray-400">Explain the service details, deliverables, and scope.</div>
                        </div>
                        <div class="w-5/6">
                            <textarea
                                v-model="serviceForm.description"
                                rows="6"
                                placeholder="Enter a Description"
                                :onfocus="() => serviceFormErrors.description = ''"
                                :class="`w-full bg-transparent border rounded-xl px-8 py-4 ${serviceFormErrors.description ? 'border-red-600' : 'border-gray-300'}`"
                            ></textarea>
                            <div class="text-red-600 text-sm mt-1">{{ serviceFormErrors.description }}</div>
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
                        <span>Delete Service</span>
                    </button>

                    <div class="flex items-center gap-4">
                        <router-link
                            to="/services"
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
                    <h3 class="text-lg font-bold text-gray-900">Delete Service</h3>
                </div>
                <p class="text-sm text-gray-600">
                    Are you sure you want to permanently delete this service? This action cannot be undone.
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
                        @click="handleDeleteService"
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
import RestCategories from "@/libs/RestCategories";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
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
const restCategories = new RestCategories(axios!);
const restFreelancerServices = new RestFreelancerServices(axios!);

const serviceId = Number(route.params.id);
const isLoadingService = ref(true);
const isSubmitting = ref(false);
const serviceNotFound = ref(false);
const showDeleteConfirm = ref(false);
const isDeleting = ref(false);

const thumbnailRef = ref<HTMLInputElement>();
const categories = ref<Category[]>([]);
const imagesList = ref<ImageItem[]>([]);

const serviceForm = reactive({
    title: "",
    category: "",
    price: 0,
    description: "",
});

const serviceFormErrors = reactive({
    title: "",
    category: "",
    price: "",
    description: "",
});

const allImagesPreview = computed(() => imagesList.value);

onMounted(async () => {
    try {
        const [catsRes, servRes] = await Promise.all([
            restCategories.getAll(),
            restFreelancerServices.getById(serviceId),
        ]);

        if (catsRes.isSuccess()) {
            categories.value = catsRes.value!;
        }

        if (servRes.isSuccess() && servRes.value) {
            const service = servRes.value;
            serviceForm.title = service.title || "";
            serviceForm.category = service.category?.name || "";
            serviceForm.price = service.price?.value ? Number(service.price.value) : 0;
            serviceForm.description = service.description || "";

            if (service.images && service.images.length > 0) {
                imagesList.value = service.images.map(img => {
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
            serviceNotFound.value = true;
        }
    } catch (err: any) {
        console.error("Failed to load service for edit:", err);
        serviceNotFound.value = true;
    } finally {
        isLoadingService.value = false;
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
    serviceFormErrors.title = "";
    serviceFormErrors.category = "";
    serviceFormErrors.price = "";
    serviceFormErrors.description = "";

    if (!serviceForm.title.trim()) {
        serviceFormErrors.title = "Title is required.";
    }

    if (!serviceForm.category) {
        serviceFormErrors.category = "Category is required.";
    }

    if (serviceForm.price <= 0) {
        serviceFormErrors.price = "Price must be greater than 0.";
    }

    if (!serviceForm.description.trim()) {
        serviceFormErrors.description = "Description is required.";
    }

    const hasErrors = Object.values(serviceFormErrors).some(err => err.length > 0);
    if (hasErrors) {
        return;
    }

    isSubmitting.value = true;
    try {
        // Collect new files to upload
        const newFiles = imagesList.value
            .filter(item => !item.isExisting && item.file)
            .map(item => item.file!);

        let uploadedPaths: string[] = [];
        if (newFiles.length > 0) {
            const uploadRes = await restFreelancerServices.uploadImages(newFiles);
            if (uploadRes.isSuccess()) {
                uploadedPaths = uploadRes.value!;
            } else {
                throw new Error(uploadRes.error || "Failed to upload images");
            }
        }

        // Collect existing image paths that were kept
        const keptExistingPaths = imagesList.value
            .filter(item => item.isExisting && item.path)
            .map(item => item.path!);

        const allImagePaths = [...keptExistingPaths, ...uploadedPaths];

        const updateRes = await restFreelancerServices.update(serviceId, {
            title: serviceForm.title,
            category: serviceForm.category,
            price: serviceForm.price,
            description: serviceForm.description,
            images: allImagePaths,
        });

        if (updateRes.isSuccess()) {
            toastManager?.value?.alertSuccess('Service updated successfully!');
            router.push('/services');
        } else {
            toastManager?.value?.alertError(updateRes.error || 'Failed to update service');
        }
    } catch (err: any) {
        console.error("Error updating service:", err);
        toastManager?.value?.alertError(err?.message || 'Failed to update service');
    } finally {
        isSubmitting.value = false;
    }
};

const handleDeleteService = async () => {
    isDeleting.value = true;
    try {
        const res = await restFreelancerServices.delete(serviceId);
        if (res.isSuccess()) {
            toastManager?.value?.alertSuccess('Service deleted successfully!');
            router.push('/services');
        } else {
            toastManager?.value?.alertError(res.error || 'Failed to delete service');
        }
    } catch (err: any) {
        console.error("Failed to delete service:", err);
        toastManager?.value?.alertError(err?.message || 'Failed to delete service');
    } finally {
        isDeleting.value = false;
        showDeleteConfirm.value = false;
    }
};
</script>
