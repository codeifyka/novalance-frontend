<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="portfolio" />
            <div class="w-full flex items-end justify-between">
                <div class="flex flex-col gap-4">
                    <div class="w-32 h-32 rounded-full object-cover bg-gray-200"></div>
                    <div class="text-xl">Abdelfetah Dev</div>
                </div>
                <div class="text-white bg-primary rounded-full px-16 py-1 font-medium">Update Profile</div>
            </div>
        </div>
        <Loading v-if="!projects" />
        <div class="w-11/12 flex flex-col gap-8">
            <div class="w-full flex items-center border-b border-gray-300">
                <div class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-primary">My Projects</div>
                    <div class="w-full bg-primary h-1 rounded-full"></div>
                </div>
                <div class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-gray-300">My Services</div>
                </div>
            </div>
            <div class="w-full grid grid-cols-5 gap-4">
                <div class="w-full flex flex-col" v-for="project in projects">
                    <a :href="`/project/${project.id}`" class="w-full flex flex-col gap-2">
                        <div class="w-full flex flex-col">
                            <img :src="project.images && project.images?.length > 0 ? project.images[0]?.url: '/default_project_thumbnail.jpg'"
                                class="w-full h-full object-cover rounded-lg" />
                        </div>
                        <div class="text-black text-base font-medium">{{ project.title }}</div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import type { AxiosInstance } from 'axios';
import { defineComponent, inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
    components: { FreeLancerHeaderVue },
    setup() {
        let route = useRoute();
        let projects = ref<Project[]>([]);

        const axios = inject<AxiosInstance>('axios');
        const restFreelancerProjects = new RestFreelancerProjects(axios!);

        onMounted(async () => {
            let response = await restFreelancerProjects.getAll(route.params.username as string);
            console.log(response);
            if (response.isSuccess()) {
                projects.value = response.value! || [];
            }
        });

        return {
            projects
        }
    }
});
</script>
