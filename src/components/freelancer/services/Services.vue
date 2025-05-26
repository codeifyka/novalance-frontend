<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
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
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import type { AxiosInstance } from 'axios';
import { inject, ref } from "vue";
import { useRoute } from "vue-router";
import { ProfileHeaderVue } from "@/components/freelancer/profile_header";

const route = useRoute();
const services = ref<Service[]>([]);

const axios = inject<AxiosInstance>('axios');
const restFreelancerServices = new RestFreelancerServices(axios!);

const response = await restFreelancerServices.getAll(route.params.username as string);
if (response.isSuccess()) {
    services.value = response.value! || [];
}

</script>
