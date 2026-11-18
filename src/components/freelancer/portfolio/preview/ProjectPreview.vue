<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center pt-20 pb-4 gap-16">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="portfolio" />
            <div class="w-2/3 flex">
                <div class="w-full flex flex-col items-center gap-8">
                    <SliderVue v-if="project && project.images!.length > 0" :images="project.images!" />
                    <SliderVue v-if="project && project.images!.length == 0"
                        :images="[{ id: 0, url: '/default_project_thumbnail.jpg', path: '/default_project_thumbnail.jpg' }]" />
                    <div class="w-full flex flex-col gap-6">
                        <div class="flex items-center justify-between">
                            <div class="text-3xl font-semibold text-black">{{ project?.title }}</div>
                            <div v-if="project" class="flex items-center gap-3">
                                <button
                                    @click="showDeleteConfirm = true"
                                    class="border border-red-300 text-red-600 hover:bg-red-50 px-5 py-2 rounded-xl font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer text-sm">
                                    <Icon icon="solar:trash-bin-trash-bold" class="text-base" />
                                    <span>Delete</span>
                                </button>
                                <router-link
                                    :to="`/update_project/${project.id}`"
                                    class="bg-primary hover:bg-opacity-90 px-6 py-2 rounded-xl text-white font-semibold shadow-sm transition flex items-center gap-2 text-sm">
                                    <Icon icon="basil:edit-solid" class="text-lg" />
                                    <span>Edit Project</span>
                                </router-link>
                            </div>
                        </div>
                        <div class="text-xl text-[#2a2a2a]">
                            {{ project?.description }}
                        </div>
                    </div>
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

<script lang="ts">
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { SliderVue } from "@/components/slider";
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import { inject, onMounted, ref, type Ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
    components: { FreeLancerHeaderVue, SliderVue },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const project = ref<Project | null>(null);
        const showDeleteConfirm = ref(false);
        const isDeleting = ref(false);

        const axios = inject<AxiosInstance>('axios');
        const toastManager = inject<Ref<ToastsManager>>("toastManager");
        const restFreelancerProjects = new RestFreelancerProjects(axios!);

        onMounted(async () => {
            let response = await restFreelancerProjects.getById(Number(route.params.id));
            if (response.isSuccess()) {
                project.value = response.value!;
            } else {
                router.push('/portfolio');
            }
        });

        const handleDeleteProject = async () => {
            if (!project.value) return;
            isDeleting.value = true;
            try {
                const res = await restFreelancerProjects.delete(Number(project.value.id));
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

        return {
            project,
            showDeleteConfirm,
            isDeleting,
            handleDeleteProject
        };
    }
}
</script>
