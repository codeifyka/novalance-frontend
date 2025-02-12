<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
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
                        <div
                            class="bg-primary self-end px-16 w-fit text-center py-2 rounded-lg text-violet-50 font-semibold mt-8">
                            BUY</div>
                    </div>
                </div>
                <div class="md:w-1/4 order-1 md:order-2 w-full flex flex-col items-end">
                    <Service v-if="service != undefined" :service="service" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { SliderVue } from "@/components/slider";
import { inject, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosInstance } from 'axios';

export default {
    components: { FreeLancerHeaderVue, SliderVue },
    setup() {
        let route = useRoute();
        let service = ref<Service | null>(null);

        const axios = inject<AxiosInstance>('axios');
        const restFreelancerServices = new RestFreelancerServices(axios!);

        onMounted(async () => {
            let response = await restFreelancerServices.getById(Number(route.params.id));
            console.log(response);
            if (response.isSuccess()) {
                service.value = response.value!;
            }
        });

        return {
            service
        };
    }
}
</script>
