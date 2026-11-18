<template>
    <div class="w-full min-h-screen bg-gray-50/30 overflow-auto flex flex-col items-center pt-20 pb-16">
        <div class="w-11/12 flex flex-col items-center gap-10">
            <FreeLancerHeaderVue target="saved_jobs" />

            <div class="w-full flex flex-col gap-6">
                <!-- Page Header -->
                <div class="flex items-center justify-between border-b pb-6">
                    <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-3">
                            <h1 class="text-3xl font-bold text-gray-900">Saved Jobs</h1>
                            <span v-if="!isLoading" class="px-3 py-1 bg-primary/10 text-primary font-semibold text-sm rounded-full">
                                {{ savedJobs.length }} {{ savedJobs.length === 1 ? 'job' : 'jobs' }}
                            </span>
                        </div>
                        <p class="text-sm text-gray-500">
                            Keep track of job opportunities you are interested in and apply when ready.
                        </p>
                    </div>

                    <router-link
                        to="/home"
                        class="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        <Icon icon="solar:magnifer-linear" class="text-base" />
                        <span>Browse more jobs</span>
                    </router-link>
                </div>

                <!-- Loading State -->
                <div v-if="isLoading" class="w-full flex flex-col items-center justify-center py-24 gap-4">
                    <LoadingSpinner class="w-10 h-10 text-primary" />
                    <span class="text-sm text-gray-400">Loading your saved jobs...</span>
                </div>

                <!-- Empty State -->
                <div
                    v-else-if="savedJobs.length === 0"
                    class="w-full flex flex-col items-center justify-center py-20 text-center bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8"
                >
                    <div class="w-20 h-20 rounded-full bg-red-50 text-red-400 flex items-center justify-center mb-4">
                        <Icon icon="solar:heart-bold" class="text-4xl" />
                    </div>
                    <h3 class="text-xl font-bold text-gray-800">No saved jobs yet</h3>
                    <p class="text-sm text-gray-500 mt-2 max-w-md">
                        When you find jobs you'd like to apply for later, click the "Save job" button on any job details page to keep them here.
                    </p>
                    <router-link
                        to="/home"
                        class="mt-6 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-opacity-90 transition shadow-sm"
                    >
                        Explore Jobs
                    </router-link>
                </div>

                <!-- Saved Jobs List -->
                <div v-else class="w-full flex flex-col gap-5">
                    <div
                        v-for="job in savedJobs"
                        :key="job.id"
                        class="w-full bg-white border border-gray-200 hover:border-primary/40 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md flex flex-col gap-4"
                    >
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex flex-col gap-1.5 flex-1">
                                <div class="text-xs text-gray-400 font-medium">
                                    Posted {{ formatDate(job.created_at) }}
                                </div>
                                <router-link
                                    :to="`/job/${job.id}`"
                                    class="text-xl font-bold text-gray-900 hover:text-primary transition line-clamp-1"
                                >
                                    {{ job.title }}
                                </router-link>
                            </div>

                            <!-- Unsave button -->
                            <button
                                @click="unsaveJob(job.id)"
                                :disabled="unsavingId === job.id"
                                type="button"
                                title="Remove from saved jobs"
                                class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition cursor-pointer shrink-0"
                            >
                                <LoadingSpinner v-if="unsavingId === job.id" class="w-3.5 h-3.5 text-red-600" />
                                <template v-else>
                                    <Icon icon="solar:heart-bold" class="text-base text-red-500" />
                                    <span>Saved</span>
                                </template>
                            </button>
                        </div>

                        <!-- Description preview -->
                        <p class="text-sm text-gray-600 line-clamp-2">
                            {{ job.description }}
                        </p>

                        <!-- Attributes row -->
                        <div class="flex items-center gap-6 flex-wrap text-sm text-gray-600 pt-2 border-t border-gray-100">
                            <div class="flex items-center gap-1.5 font-semibold text-emerald-600">
                                <Icon icon="solar:tag-price-bold" class="text-base" />
                                <span>${{ job.budjet }}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <Icon icon="icon-park-outline:tree-diagram" class="text-base text-gray-400" />
                                <span>{{ job.experience_level }}</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <Icon icon="solar:document-text-bold" class="text-base text-gray-400" />
                                <span>{{ job.proposals_count ?? 0 }} proposals</span>
                            </div>
                            <div v-if="job.user?.country" class="flex items-center gap-1.5 text-gray-500">
                                <Icon icon="solar:map-point-bold" class="text-base text-gray-400" />
                                <span>{{ job.user.country }}</span>
                            </div>
                        </div>

                        <!-- Categories -->
                        <div v-if="job.categories && job.categories.length > 0" class="flex items-center gap-2 flex-wrap pt-1">
                            <span
                                v-for="cat in job.categories"
                                :key="cat.id"
                                class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                            >
                                {{ cat.name }}
                            </span>
                        </div>

                        <!-- Card Footer -->
                        <div class="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                            <router-link
                                :to="`/job/${job.id}`"
                                class="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                            >
                                <span>View job details</span>
                                <Icon icon="solar:arrow-right-linear" />
                            </router-link>

                            <router-link
                                :to="`/job/${job.id}/submit_proposal`"
                                class="px-5 py-2 bg-primary hover:bg-opacity-90 text-white text-sm font-semibold rounded-full transition shadow-sm"
                            >
                                Apply now
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestSavedJobs from "@/libs/RestSavedJobs";
import type ToastsManager from "@/libs/ToastsManager";
import { inject, onMounted, ref, type Ref } from 'vue';
import type { AxiosInstance } from 'axios';
import moment from 'moment';

const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>('toastManager');
const restSavedJobs = new RestSavedJobs(axios!);

const savedJobs = ref<JobPost[]>([]);
const isLoading = ref(true);
const unsavingId = ref<number | null>(null);

const fetchSavedJobs = async () => {
    isLoading.value = true;
    try {
        const res = await restSavedJobs.getSavedJobs();
        if (res.isSuccess()) {
            savedJobs.value = res.value! || [];
        } else {
            toastManager?.value?.alertError(res.error || 'Failed to load saved jobs.');
        }
    } catch (err: any) {
        toastManager?.value?.alertError(err?.message || 'Failed to load saved jobs.');
    } finally {
        isLoading.value = false;
    }
};

const unsaveJob = async (jobId: number) => {
    if (unsavingId.value !== null) return;
    unsavingId.value = jobId;
    try {
        const res = await restSavedJobs.toggleSave(jobId);
        if (res.isSuccess()) {
            savedJobs.value = savedJobs.value.filter(j => j.id !== jobId);
            toastManager?.value?.alertSuccess('Job removed from saved jobs.');
        } else {
            toastManager?.value?.alertError(res.error || 'Failed to remove job.');
        }
    } catch (err: any) {
        toastManager?.value?.alertError(err?.message || 'Failed to remove job.');
    } finally {
        unsavingId.value = null;
    }
};

const formatDate = (date?: string): string => {
    if (!date) return '';
    return moment(date).fromNow();
};

onMounted(() => {
    fetchSavedJobs();
});
</script>
