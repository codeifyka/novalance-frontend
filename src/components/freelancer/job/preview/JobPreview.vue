<template>
    <Loading v-if="isLoading" />
    <div class="w-full flex flex-col items-center gap-16 py-4">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="services" />
            <div class="w-full flex justify-between">
                <div class="flex flex-col gap-12">
                    <div class="flex flex-col gap-2">
                        <div class="text-2xl font-semibold text-black">{{ job?.title }}</div>
                        <div class="text-base font-medium text-[#a5a5a5]">Posted {{ formatDate(job?.created_at) }}</div>
                    </div>
                    <div class="py-16 border-t border-b">
                        {{ job?.description }}
                    </div>
                    <div class="flex items-center gap-32">
                        <div class="flex items-center gap-4">
                            <Icon icon="solar:tag-price-bold" class="text-xl" />
                            <div class="text-xl">${{ job?.budjet }}</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <Icon icon="icon-park-outline:tree-diagram" class="text-xl" />
                            <div class="text-xl">{{ job?.experience_level }}</div>
                        </div>
                    </div>
                    <div class="py-16 border-t border-b flex flex-col gap-8">
                        <div class="text-2xl font-semibold text-black">Skills and Expertise</div>
                        <div class="flex items-center gap-4">
                            <div class="py-2 px-4 bg-gray-200 rounded-full">React</div>
                            <div class="py-2 px-4 bg-gray-200 rounded-full">TypeScript</div>
                            <div class="py-2 px-4 bg-gray-200 rounded-full">NodeJS</div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8">
                        <div class="text-2xl font-semibold text-black">Activity on this job</div>
                        <div class="flex flex-col gap-2">
                            <div class="flex items-center gap-4">
                                <div>Proposals:</div>
                                <div>less than 5</div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div>Invterviewing:</div>
                                <div>2</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-1/4 flex flex-col gap-16">
                    <div class="flex flex-col gap-4">
                        <div
                            class="py-2 bg-primary border border-primary rounded-full text-white font-semibold text-center">
                            Apply now</div>
                        <div
                            class="py-2 flex items-center justify-center gap-2 border border-primary rounded-full text-primary font-semibold text-center">
                            <Icon icon="mdi:heart-outline" />
                            <div class="text-base">Save job</div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8">
                        <div class="text-2xl font-semibold text-black">About the client</div>
                        <div class="flex flex-col gap-2">
                            <div class="text-black">176 jobs posted</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestClientJobs from "@/libs/RestClientJobs";
import RestProposals from "@/libs/RestProposals";
import { SliderVue } from "@/components/slider";
import { inject, onMounted, ref, type Ref } from "vue";
import { useRoute } from "vue-router";
import { JobPostVue } from '@/components/childcomponent/job_post';
import { ModalVue } from '@/components/modal';
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import moment from 'moment';

export default {
    components: {
        FreeLancerHeaderVue,
        SliderVue,
        JobPostVue,
        ModalVue
    },
    setup() {
        const isLoading = ref(false);
        let toastManager = inject<Ref<ToastsManager>>("toastManager");
        const colors = ref({
            'text': 'text-purple-700',
            'background': "bg-violet-50/60",
        })
        const isSent = ref(false)
        var isModalOpen = ref(false);
        let route = useRoute();
        const axios = inject<AxiosInstance>('axios');
        const restClientJobs = new RestClientJobs(axios!);
        const restProposals = new RestProposals(axios!);
        let job = ref<JobPost | null>(null)

        onMounted(async () => {
            let response = await restClientJobs.getById(Number(route.params.id));
            if (response.isSuccess()) {
                job.value = response.value!;
            }
        });

        onMounted(async () => {
            let response = await restProposals.getByFreelancerJobId(Number(route.params.id));
            console.log(response)
            if (response) {
                isSent.value = true;
            }
        })

        const openModal = () => {
            isModalOpen.value = true;
        }

        const handleSend = async (coverLetter: string) => {
            try {
                isLoading.value = true;
                console.log('Cover Letter Sent:', coverLetter);
                let response = await restProposals.create({
                    job_post_id: Number(route.params.id),
                    cover_letter: coverLetter,
                });
                if (response) {
                    toastManager?.value.alertSuccess("Sent proposal successfuly.");
                    isModalOpen.value = false;
                    isSent.value = true;
                }
            } catch (error: any) {
                isLoading.value = false;
                console.log(error);
                toastManager?.value.alertError(error);
            }
        }

        const formatDate = (date?: string): string => moment(date).fromNow();

        return {
            job, colors, isModalOpen,
            openModal,
            handleSend,
            isSent,
            isLoading,
            formatDate
        };
    }
}
</script>
