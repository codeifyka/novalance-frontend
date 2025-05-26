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
            <div class="w-full grid grid-cols-5 gap-4">
                <div class="w-full flex flex-col" v-for="project in projects">
                    <a :href="`/project/${project.id}`" class="w-full flex flex-col gap-2">
                        <div class="w-full flex flex-col">
                            <img :src="project.images && project.images?.length > 0 ? project.images[0]?.url : '/default_project_thumbnail.jpg'"
                                class="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div class="text-black text-base font-medium">{{ project.title }}</div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import type { AxiosInstance } from 'axios';
import { inject, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ProfileHeaderVue } from "@/components/freelancer/profile_header";

const route = useRoute();
const projects = ref<Project[]>([]);

const axios = inject<AxiosInstance>('axios');
const restFreelancerProjects = new RestFreelancerProjects(axios!);

const response = await restFreelancerProjects.getAll(route.params.username as string);
if (response.isSuccess()) {
    projects.value = response.value! || [];
}
</script>
