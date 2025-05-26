<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="home" />
            <div class="w-full flex flex-row gap-16">
                <div class="w-2/3 flex flex-col gap-8">
                    <div class="flex items-center border rounded-full">
                        <input class="bg-transparent outline-none w-full px-8 py-2 text-black placeholder:text-gray-400"
                            placeholder="Search..." />
                        <div class="px-4 py-3 rounded-r-full bg-primary text-white">
                            <Icon icon="material-symbols:search" class="text-lg" />
                        </div>
                    </div>
                    <div class="w-full h-px bg-gray-200"></div>
                    <JobPostVue v-motion-slide-visible-once-top :colors="colors" :job="job" v-for="job in jobs" />
                </div>
                <div class="w-1/3 flex flex-col items-center">
                    <div class="w-full flex flex-col items-center border rounded-2xl py-8 px-8 gap-8">
                        <div class="flex flex-col items-center gap-2">
                            <div class="h-28 w-28 rounded-full">
                                <img class="w-full h-full rounded-full object-cover" :src="DEFAULT_PROFILE_PICTURE"
                                    alt="profile picture">
                            </div>
                            <div class="text-black text-base">{{ user_info?.user.username }}</div>
                        </div>
                        <div class="flex items-center gap-16">
                            <div class="flex flex-col">
                                <div class="flex items-center text-black font-medium">
                                    <Icon icon="icons8:services" class="mr-2" />Services:
                                </div>
                                <div class="flex items-center text-black font-medium">
                                    <Icon icon="material-symbols:sell-outline" class="mr-2" />Sells:
                                </div>
                                <div class="flex items-center text-black font-medium">
                                    <Icon icon="bytesize:portfolio" class="mr-2" />Projects:
                                </div>
                            </div>
                            <div class="flex flex-col items-center">
                                <div class="text-black">{{ user_info?.services || 0 }}</div>
                                <div class="text-black">{{ user_info?.sells || 0 }}</div>
                                <div class="text-black">{{ user_info?.projects || 0 }}</div>
                            </div>
                        </div>

                        <div class="w-full flex flex-col items-center gap-2">
                            <div class="w-full flex items-center justify-between font-semibold text-black">
                                <div class="text-sm">PROPOSALS</div>
                                <Icon icon="uil:angle-down" class="text-xl" />
                            </div>
                            <div class="w-full flex flex-col gap-2 px-4">
                                <router-link to="proposals" class="text-xs text-black underline">my
                                    proposals</router-link>
                                <div class="text-xs text-black underline pb-1">{{user_info?.proposals}} submited proposals</div>
                            </div>
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
import { inject, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import { JobPostVue } from '@/components/job_post';

const colors = ref({
    'text': 'text-violet-700',
    'background': "bg-violet-50/60",
})

const axios = inject<AxiosInstance>("axios");
const user_info = inject<UserInfo>("user_info");
const jobs = ref<JobPost[]>([]);

const restClientJobs = new RestClientJobs(axios!)
const getJobsResult = await restClientJobs.getAll();
if (getJobsResult.isSuccess()) {
    jobs.value = getJobsResult.value! || [];
}

</script>
