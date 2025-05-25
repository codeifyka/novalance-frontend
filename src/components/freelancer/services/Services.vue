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
        <Loading v-if="!services" />
        <div class="w-11/12 flex flex-col gap-8">
            <div class="w-full flex items-center border-b border-gray-300">
                <a href="/portfolio" class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-gray-300">My Projects</div>
                </a>
                <a href="/services" class="w-fit flex flex-col">
                    <div class="px-4 py-2 text-primary">My Services</div>
                    <div class="w-full bg-primary h-1 rounded-full"></div>
                </a>
            </div>
            <div class="w-full grid grid-cols-5 gap-4">
                <div class="w-full flex flex-col" v-for="service in services">
                    <a :href="`/service/${service.id}`" class="w-full flex flex-col gap-2">
                        <Service v-motion-slide-visible-once-top :service="service" />
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import type { AxiosInstance } from 'axios';
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const services = ref<Service[]>([]);

const axios = inject<AxiosInstance>('axios');
const restFreelancerServices = new RestFreelancerServices(axios!);

onMounted(async () => {
    const response = await restFreelancerServices.getAll(route.params.username as string);
    console.log(response);
    if (response.isSuccess()) {
        services.value = response.value! || [];
    }
});

</script>
