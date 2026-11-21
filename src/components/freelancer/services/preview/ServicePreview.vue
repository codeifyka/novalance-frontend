<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center pt-24 md:pt-28 pb-4 gap-16">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="services" />
            <div class="w-full flex flex-row gap-16">
                <div class="w-3/4 flex flex-col items-center">
                    <SliderVue v-if="service && service.images!.length > 0" :images="service?.images || []" />
                    <SliderVue v-if="service && service.images!.length == 0"
                        :images="[{ id: 0, url: '/default_service_thumbnail.jpg', path: '/default_service_thumbnail.jpg' }]" />
                    <div class="w-full flex flex-col gap-7">
                        <div class="flex items-center justify-between mt-8 mb-2">
                            <div class="text-3xl font-semibold text-black">{{ service?.title }}</div>
                            <div class="font-semibold text-green-500 text-xl">${{ service?.price?.value }}</div>
                        </div>
                        <div class="text-xl text-[#2a2a2a]">{{ service?.description }}</div>
                        <div v-if="service" class="flex items-center gap-4 self-end mt-8">
                            <button
                                @click="showDeleteConfirm = true"
                                class="border border-red-300 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer">
                                <Icon icon="solar:trash-bin-trash-bold" class="text-lg" />
                                <span>Delete Service</span>
                            </button>
                            <router-link
                                :to="`/update_service/${service.id}`"
                                class="bg-primary hover:bg-opacity-90 px-10 text-center py-2.5 rounded-xl text-white font-semibold shadow-sm transition flex items-center gap-2">
                                <Icon icon="basil:edit-solid" class="text-xl" />
                                <span>Edit Service</span>
                            </router-link>
                        </div>
                    </div>
                </div>
                <div class="md:w-1/4 order-1 md:order-2 w-full flex flex-col items-end">
                    <Service v-if="service != undefined" :service="service" />
                </div>
            </div>
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

<script lang="ts">
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { SliderVue } from "@/components/slider";
import type ToastsManager from '@/libs/ToastsManager';
import { inject, onMounted, ref, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { AxiosInstance } from 'axios';

export default {
    components: { FreeLancerHeaderVue, SliderVue },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const service = ref<Service | null>(null);
        const showDeleteConfirm = ref(false);
        const isDeleting = ref(false);

        const axios = inject<AxiosInstance>('axios');
        const toastManager = inject<Ref<ToastsManager>>("toastManager");
        const restFreelancerServices = new RestFreelancerServices(axios!);

        onMounted(async () => {
            let response = await restFreelancerServices.getById(Number(route.params.id));
            if (response.isSuccess()) {
                service.value = response.value!;
            }
        });

        const handleDeleteService = async () => {
            if (!service.value) return;
            isDeleting.value = true;
            try {
                const res = await restFreelancerServices.delete(service.value.id);
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

        return {
            service,
            showDeleteConfirm,
            isDeleting,
            handleDeleteService
        };
    }
}
</script>
