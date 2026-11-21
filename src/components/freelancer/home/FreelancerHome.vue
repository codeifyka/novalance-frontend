<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center pt-24 md:pt-28 pb-4">
        <div class="w-11/12 flex flex-col items-center gap-16">
            <FreeLancerHeaderVue target="home" />
            <div class="w-full flex flex-row gap-16">
                <div class="w-2/3 flex flex-col gap-8">
                    <!-- Search Bar -->
                    <div class="flex items-center border rounded-full bg-white shadow-sm focus-within:border-primary transition-colors">
                        <input
                            v-model="searchQuery"
                            @keyup.enter="onSearch"
                            class="bg-transparent outline-none w-full px-8 py-2 text-black placeholder:text-gray-400"
                            placeholder="Search jobs by title, description or skills..."
                        />
                        <button
                            v-if="searchQuery"
                            @click="clearSearch"
                            type="button"
                            class="px-2 text-gray-400 hover:text-gray-600 cursor-pointer"
                            title="Clear search"
                        >
                            <Icon icon="material-symbols:close" class="text-lg" />
                        </button>
                        <button
                            @click="onSearch"
                            type="button"
                            class="px-4 py-3 rounded-r-full bg-primary hover:bg-purple text-white cursor-pointer transition-colors"
                            title="Search"
                        >
                            <Icon icon="material-symbols:search" class="text-lg" />
                        </button>
                    </div>
                    <div class="w-full h-px bg-gray-200"></div>

                    <!-- Empty state -->
                    <div v-if="filteredJobs.length === 0" class="w-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <Icon icon="material-symbols:search-off" class="text-4xl mb-2 text-gray-400" />
                        <p class="font-medium text-base text-gray-700">No jobs found</p>
                        <p class="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
                    </div>

                    <!-- Job list -->
                    <JobPostVue
                        v-else
                        v-motion-slide-visible-once-top
                        :colors="colors"
                        :job="job"
                        v-for="job in filteredJobs"
                        :key="job.id"
                        @remove-job="removeJob"
                    />
                </div>
                <div class="w-1/3 flex flex-col items-center">
                    <div class="w-full flex flex-col items-center border rounded-2xl py-8 px-8 gap-8">
                        <div class="flex flex-col items-center gap-2">
                            <div class="h-28 w-28 rounded-full overflow-hidden">
                                <img
                                    class="w-full h-full rounded-full object-cover"
                                    :src="user_info?.user?.profile_picture || DEFAULT_PROFILE_PICTURE"
                                    alt="profile picture"
                                >
                            </div>
                            <div class="text-black text-base font-medium">{{ user_info?.user.username }}</div>
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
                                <router-link to="/proposals" class="text-xs text-black underline">my proposals</router-link>
                                <div class="text-xs text-black underline pb-1">{{ user_info?.proposals || 0 }} submitted proposals</div>
                            </div>
                        </div>

                        <div class="w-full flex flex-col items-center gap-2">
                            <div class="w-full flex items-center justify-between font-semibold text-black">
                                <div class="text-sm">SAVED JOBS</div>
                                <Icon icon="uil:angle-down" class="text-xl" />
                            </div>
                            <div class="w-full flex flex-col gap-2 px-4">
                                <router-link to="/saved_jobs" class="text-xs text-black underline flex items-center gap-1">
                                    <Icon icon="solar:bookmark-linear" class="text-sm" />
                                    <span>my saved jobs</span>
                                </router-link>
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
import { computed, inject, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import { JobPostVue } from '@/components/job_post';

const colors = ref({
    'text': 'text-violet-700',
    'background': "bg-violet-50/60",
});

const axios = inject<AxiosInstance>("axios");
const user_info = inject<UserInfo>("user_info");
const allJobs = ref<JobPost[]>([]);
const searchQuery = ref('');

const filteredJobs = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) return allJobs.value;
    return allJobs.value.filter(job => {
        const titleMatch = job.title?.toLowerCase().includes(q);
        const descMatch = job.description?.toLowerCase().includes(q);
        const categoryMatch = job.categories?.some(c => {
            const name = typeof c === 'string' ? c : c.name;
            return name?.toLowerCase().includes(q);
        });
        return Boolean(titleMatch || descMatch || categoryMatch);
    });
});

const onSearch = () => {
    // Reactive filtering updates automatically through filteredJobs computed
};

const clearSearch = () => {
    searchQuery.value = '';
};

const removeJob = (jobId: number) => {
    allJobs.value = allJobs.value.filter(j => j.id !== jobId);
};

const restClientJobs = new RestClientJobs(axios!);
const getJobsResult = await restClientJobs.getAll();
if (getJobsResult.isSuccess()) {
    allJobs.value = getJobsResult.value! || [];
}
</script>
