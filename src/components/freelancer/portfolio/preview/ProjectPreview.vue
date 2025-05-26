<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="portfolio" />
            <div class="w-2/3 flex">
                <div class="w-full flex flex-col items-center gap-8">
                    <SliderVue v-if="project && project.images!.length > 0" :images="project.images!" />
                    <SliderVue v-if="project && project.images!.length == 0"
                        :images="[{ id: 0, url: '/default_project_thumbnail.jpg', path: '/default_project_thumbnail.jpg' }]" />
                    <div class="w-full flex flex-col gap-6">
                        <div class="text-3xl font-semibold text-black">{{ project?.title }}</div>
                        <div class="text-xl text-[#2a2a2a]">
                            {{ project?.description }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { SliderVue } from "@/components/slider";
import RestFreelancerProjects from '@/libs/RestFreelancerProjects';
import type { AxiosInstance } from 'axios';
import { inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
    components: { FreeLancerHeaderVue, SliderVue },
    setup() {
        let route = useRoute();
        let project = ref<Project | null>(null);

        const axios = inject<AxiosInstance>('axios');
        const restFreelancerProjects = new RestFreelancerProjects(axios!);

        onMounted(async () => {
            let response = await restFreelancerProjects.getById(Number(route.params.id));
            console.log(response);
            if (response.isSuccess()) {
                project.value = response.value!;
            } else {
                window.location.href = "/portfolio"
            }
        });

        return {
            project
        }
    }
}
</script>
