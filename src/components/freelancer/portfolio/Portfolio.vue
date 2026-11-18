<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <ProfileHeaderVue target="portfolio" />
        <div class="w-11/12 flex flex-col gap-8">
            <div class="w-full flex items-center border-b border-gray-300">
                <a href="/portfolio" class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-primary">My Projects</div>
                    <div class="w-full bg-primary h-1 rounded-full"></div>
                </a>
                <a href="/services" class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-gray-300 hover:text-purple">My Services</div>
                </a>
            </div>

            <div v-if="projects.length == 0" class="w-full flex flex-col items-center">
                <div
                    class="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-300 text-center shadow-sm">
                    <h2 class="text-xl font-semibold text-gray-800 mb-2">No Projects Available</h2>
                    <p class="text-gray-600 text-sm">Once you add a project to your portfolio, it will appear here for easy access and management.</p>
                </div>
            </div>

            <div class="w-full grid grid-cols-5 gap-4">
                <div class="w-full flex flex-col bg-white rounded-xl border border-gray-100 p-2 shadow-sm hover:shadow transition" v-for="project in projects" :key="project.id">
                    <a :href="`/project/${project.id}`" class="w-full flex flex-col gap-2">
                        <div class="w-full h-40 bg-violet-100 rounded-lg overflow-hidden">
                            <img :src="project.images && project.images.length > 0 ? (project.images[0]?.url || '/' + project.images[0]?.path) : '/default_project_thumbnail.jpg'"
                                class="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div class="text-black text-base font-medium truncate pt-1">{{ project.title }}</div>
                    </a>
                    <div class="w-full flex items-center justify-between border-t border-gray-100 pt-2 mt-2">
                        <router-link
                            :to="`/project/${project.id}`"
                            class="text-xs text-gray-500 hover:text-primary transition"
                        >
                            View
                        </router-link>
                        <div class="flex items-center gap-1.5">
                            <button
                                @click="promptDelete(project)"
                                class="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-0.5 py-1 px-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
                                title="Delete project"
                            >
                                <Icon icon="solar:trash-bin-trash-bold" class="text-sm" />
                                <span>Delete</span>
                            </button>
                            <router-link
                                :to="`/update_project/${project.id}`"
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
        <div v-if="projectToDelete" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4">
                <div class="flex items-center gap-3 text-red-600">
                    <div class="p-3 bg-red-100 rounded-full">
                        <Icon icon="solar:trash-bin-trash-bold" class="text-2xl" />
                    </div>
                    <h3 class="text-lg font-bold text-gray-900">Delete Project</h3>
                </div>
                <p class="text-sm text-gray-600">
                    Are you sure you want to delete <span class="font-semibold text-gray-900">"{{ projectToDelete.title }}"</span>? This action cannot be undone.
                </p>
                <div class="flex items-center justify-end gap-3 mt-4">
                    <button
                        type="button"
                        @click="projectToDelete = null"
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
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import { inject, ref, type Ref } from 'vue';
import { useRoute } from 'vue-router';
import { ProfileHeaderVue } from "@/components/freelancer/profile_header";

const route = useRoute();
const projects = ref<Project[]>([]);
const projectToDelete = ref<Project | null>(null);
const isDeleting = ref(false);

const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>("toastManager");
const restFreelancerProjects = new RestFreelancerProjects(axios!);

const response = await restFreelancerProjects.getAll(route.params.username as string);
if (response.isSuccess()) {
    projects.value = response.value! || [];
}

const promptDelete = (project: Project) => {
    projectToDelete.value = project;
};

const confirmDelete = async () => {
    if (!projectToDelete.value) return;
    isDeleting.value = true;
    try {
        const res = await restFreelancerProjects.delete(Number(projectToDelete.value.id));
        if (res.isSuccess()) {
            projects.value = projects.value.filter(p => p.id !== projectToDelete.value!.id);
            toastManager?.value?.alertSuccess('Project deleted successfully!');
        } else {
            toastManager?.value?.alertError(res.error || 'Failed to delete project');
        }
    } catch (err: any) {
        console.error("Failed to delete project:", err);
        toastManager?.value?.alertError(err?.message || 'Failed to delete project');
    } finally {
        isDeleting.value = false;
        projectToDelete.value = null;
    }
};
</script>
