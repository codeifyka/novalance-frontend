<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center pt-20 pb-4 gap-16">
        <ProfileHeaderVue target="services" />
        <div class="w-11/12 flex flex-col gap-8">
            <div class="w-full flex items-center border-b border-gray-300">
                <a href="/portfolio" class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-gray-300 hover:text-purple">My Projects</div>
                </a>
                <a href="/services" class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-primary">My Services</div>
                    <div class="w-full bg-primary h-1 rounded-full"></div>
                </a>
            </div>
            <div v-if="services.length == 0" class="w-full flex flex-col items-center">
                <div
                    class="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center shadow-sm">
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">No Services Available</h2>
                    <p class="text-gray-600 text-sm">Once you create a service, it will appear here for easy access and
                        management.</p>
                </div>
            </div>
            <div class="w-full grid grid-cols-5 gap-4">
                <div class="w-full flex flex-col bg-white rounded-xl border border-gray-100 p-2 shadow-sm hover:shadow transition" v-for="service in services" :key="service.id">
                    <a :href="`/service/${service.id}`" class="w-full flex flex-col gap-2">
                        <Service v-motion-slide-visible-once-top :service="service" />
                    </a>
                    <div class="w-full flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
                        <router-link
                            :to="`/service/${service.id}`"
                            class="text-xs text-gray-500 hover:text-primary transition"
                        >
                            View
                        </router-link>
                        <div class="flex items-center gap-1.5">
                            <button
                                @click="promptDelete(service)"
                                class="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-0.5 py-1 px-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                title="Delete service"
                            >
                                <Icon icon="solar:trash-bin-trash-bold" class="text-sm" />
                                <span>Delete</span>
                            </button>
                            <router-link
                                :to="`/update_service/${service.id}`"
                                class="text-xs font-semibold text-primary hover:text-purple flex items-center gap-1 py-1 px-2.5 rounded-lg bg-violet-50 hover:bg-violet-100 transition"
                            >
                                <Icon icon="basil:edit-solid" class="text-sm" />
                                <span>Edit</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="serviceToDelete" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
                <div class="flex items-center gap-3 text-red-600">
                    <div class="p-3 bg-red-100 rounded-full">
                        <Icon icon="solar:trash-bin-trash-bold" class="text-2xl" />
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">Delete Service</h3>
                </div>
                <p class="text-sm text-gray-600">
                    Are you sure you want to delete <span class="font-semibold text-gray-900">"{{ serviceToDelete.title }}"</span>? This action cannot be undone.
                </p>
                <div class="flex items-center justify-end gap-3 mt-4">
                    <button
                        type="button"
                        @click="serviceToDelete = null"
                        :disabled="isDeleting"
                        class="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition text-sm cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        @click="confirmDelete"
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
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import { inject, ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import { ProfileHeaderVue } from "@/components/freelancer/profile_header";

const route = useRoute();
const services = ref<Service[]>([]);
const serviceToDelete = ref<Service | null>(null);
const isDeleting = ref(false);

const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>("toastManager");
const restFreelancerServices = new RestFreelancerServices(axios!);

const response = await restFreelancerServices.getAll(route.params.username as string);
if (response.isSuccess()) {
    services.value = response.value! || [];
}

const promptDelete = (service: Service) => {
    serviceToDelete.value = service;
};

const confirmDelete = async () => {
    if (!serviceToDelete.value) return;
    isDeleting.value = true;
    try {
        const res = await restFreelancerServices.delete(serviceToDelete.value.id);
        if (res.isSuccess()) {
            services.value = services.value.filter(s => s.id !== serviceToDelete.value!.id);
            toastManager?.value?.alertSuccess('Service deleted successfully!');
        } else {
            toastManager?.value?.alertError(res.error || 'Failed to delete service');
        }
    } catch (err: any) {
        console.error("Failed to delete service:", err);
        toastManager?.value?.alertError(err?.message || 'Failed to delete service');
    } finally {
        isDeleting.value = false;
        serviceToDelete.value = null;
    }
};

</script>
