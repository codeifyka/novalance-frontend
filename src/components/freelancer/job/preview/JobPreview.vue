<template>
    <Loading v-if="isLoading" />
    <div class="w-full flex flex-col items-center gap-16 py-4">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="services" />
            <div class="w-full flex justify-between">
                <div class="w-3/4 flex flex-col">
                    <div class="w-11/12 flex flex-col gap-12">
                        <div class="flex flex-col gap-2">
                            <div class="text-2xl font-semibold text-black">{{ job?.title }}</div>
                            <div class="text-base font-medium text-[#a5a5a5]">Posted {{ formatDate(job?.created_at) }}
                            </div>
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
                </div>
                <div class="w-1/4 flex flex-col gap-16">
                    <div class="flex flex-col gap-4">
                        <router-link :to="`/job/${job?.id}/submit_proposal`"
                            class="py-2 bg-primary border border-primary rounded-full text-white font-semibold text-center">
                            Apply now</router-link>
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

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestClientJobs from "@/libs/RestClientJobs";
import RestProposals from "@/libs/RestProposals";
import { inject, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosInstance } from 'axios';
import moment from 'moment';


const isLoading = ref(false);
const isSent = ref(false)
const route = useRoute();
const axios = inject<AxiosInstance>('axios');
const restClientJobs = new RestClientJobs(axios!);
const restProposals = new RestProposals(axios!);
const job = ref<JobPost | null>(null);

const getJobByIdResult = await restClientJobs.getById(Number(route.params.id));
if (getJobByIdResult.isSuccess()) {
    job.value = getJobByIdResult.value!;
}
try {
    const getProposalByJobIdResult = await restProposals.getProposalByJobId(Number(route.params.id));
    if (getProposalByJobIdResult.isSuccess()) {
        console.log("result:", getProposalByJobIdResult.value);
        isSent.value = true
    }
}
catch (error) {
    console.log({ error });
    isSent.value = false;
}
const formatDate = (date?: string): string => moment(date).fromNow();
</script>
