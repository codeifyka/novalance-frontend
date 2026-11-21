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
                            @input="onSearchInput"
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

                    <!-- Loading state -->
                    <div v-if="isLoading" class="w-full py-12 text-center text-sm text-gray-500">
                        Loading jobs...
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="jobs.length === 0" class="w-full flex flex-col items-center justify-center py-12 text-center text-gray-500">
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
                        v-for="job in jobs"
                        :key="job.id"
                        @remove-job="removeJob"
                    />

                    <Pagination
                        :current-page="currentPage"
                        :last-page="lastPage"
                        :per-page="perPage"
                        :total="totalJobs"
                        item-label="jobs"
                        @change-page="goToPage"
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
import { PaginationVue as Pagination } from '@/components/pagination';
import { JobPostVue } from '@/components/job_post';
import RestClientJobs from "@/libs/RestClientJobs";
import { inject, onMounted, onUnmounted, ref } from 'vue';
import type { AxiosInstance } from 'axios';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';

const colors = ref({
    'text': 'text-violet-700',
    'background': "bg-violet-50/60",
});

const axios = inject<AxiosInstance>("axios");
const user_info = inject<UserInfo>("user_info");
const restClientJobs = new RestClientJobs(axios!);

const jobs = ref<JobPost[]>([]);
const searchQuery = ref('');
const isLoading = ref(false);

const currentPage = ref(1);
const lastPage = ref(1);
const perPage = ref(6);
const totalJobs = ref(0);

// Ignore responses from requests that were superseded by a newer search/page change.
let latestRequestId = 0;

const fetchJobs = async () => {
    const requestId = ++latestRequestId;
    isLoading.value = true;
    try {
        const response = await restClientJobs.getPaginated({
            page: currentPage.value,
            per_page: perPage.value,
            search: searchQuery.value.trim() || undefined,
        });

        if (requestId !== latestRequestId) return;

        if (response.isSuccess() && response.value) {
            jobs.value = response.value.items || [];
            currentPage.value = response.value.current_page || 1;
            lastPage.value = response.value.last_page || 1;
            totalJobs.value = response.value.total || 0;
        } else {
            jobs.value = [];
            lastPage.value = 1;
            totalJobs.value = 0;
        }
    } catch (err) {
        console.error('Failed to load jobs:', err);
        jobs.value = [];
        lastPage.value = 1;
        totalJobs.value = 0;
    } finally {
        if (requestId === latestRequestId) {
            isLoading.value = false;
        }
    }
};

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const search = (resetPage: boolean) => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    if (resetPage) currentPage.value = 1;
    fetchJobs();
};

const onSearchInput = () => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        currentPage.value = 1;
        fetchJobs();
    }, 350);
};

const onSearch = () => search(true);

const clearSearch = () => {
    searchQuery.value = '';
    search(true);
};

const goToPage = (page: number) => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    currentPage.value = page;
    fetchJobs();
};

const removeJob = async (jobId: number) => {
    jobs.value = jobs.value.filter(job => job.id !== jobId);
    if (totalJobs.value > 0) totalJobs.value -= 1;
    if (jobs.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        await fetchJobs();
    }
};

onMounted(fetchJobs);

onUnmounted(() => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
});
</script>
