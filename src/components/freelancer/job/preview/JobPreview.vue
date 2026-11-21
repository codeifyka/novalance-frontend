<template>
    <Loading v-if="isLoading" />
    <div v-if="job !== null" class="w-full flex flex-col items-center gap-16 pt-24 md:pt-28 pb-4">
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
                            <div class="flex items-center gap-4 flex-wrap">
                                <div
                                    class="py-2 px-4 bg-gray-200 rounded-full"
                                    v-for="category in job?.categories"
                                    :key="category.id"
                                >
                                    {{ category.name }}
                                </div>
                            </div>
                        </div>
                        <div class="flex flex-col gap-8">
                            <div class="text-2xl font-semibold text-black">Activity on this job</div>
                            <div class="flex flex-col gap-2">
                                <div class="flex items-center gap-4">
                                    <div>Proposals:</div>
                                    <div>{{ job?.proposals_count ?? 0 }}</div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div>Invterviewing:</div>
                                    <div>{{ job?.active_proposals_count ?? 0 }}</div>
                                </div>
                            </div>
                        </div>
                        <div class="py-16 border-t flex flex-col gap-6">
                            <div class="flex items-center justify-between">
                                <div class="text-2xl font-semibold text-black">Illustrative files</div>
                                <button
                                    v-if="isFileValid(job?.illustrative_files)"
                                    @click="downloadFile(job?.illustrative_files)"
                                    type="button"
                                    class="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    <Icon icon="solar:download-minimalistic-bold" class="text-lg" />
                                    <span>Download file</span>
                                </button>
                            </div>

                            <div v-if="isFileValid(job?.illustrative_files)" class="flex flex-col gap-4">
                                <div
                                    v-if="isImageFile(job?.illustrative_files)"
                                    class="group relative max-w-md rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer bg-gray-50"
                                    @click="downloadFile(job?.illustrative_files)"
                                    title="Click to download"
                                >
                                    <img
                                        :src="getFileUrl(job?.illustrative_files)"
                                        :alt="getFileName(job?.illustrative_files)"
                                        class="w-full max-h-80 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium">
                                        <Icon icon="solar:download-minimalistic-bold" class="text-2xl" />
                                        <span>Click to download</span>
                                    </div>
                                    <div class="p-3 bg-white border-t border-gray-100 flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700 truncate max-w-[280px]">
                                            {{ getFileName(job?.illustrative_files) }}
                                        </span>
                                        <span class="text-xs text-primary font-semibold flex items-center gap-1">
                                            <Icon icon="solar:download-minimalistic-bold" /> Download
                                        </span>
                                    </div>
                                </div>
                                <div
                                    v-else
                                    class="flex items-center justify-between p-4 max-w-md bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer group"
                                    @click="downloadFile(job?.illustrative_files)"
                                    title="Click to download"
                                >
                                    <div class="flex items-center gap-3 truncate">
                                        <div class="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                            <Icon icon="solar:document-text-bold" class="text-xl" />
                                        </div>
                                        <div class="flex flex-col truncate">
                                            <span class="text-sm font-semibold text-gray-800 truncate">
                                                {{ getFileName(job?.illustrative_files) }}
                                            </span>
                                            <span class="text-xs text-gray-500">Attachment</span>
                                        </div>
                                    </div>
                                    <div class="shrink-0 text-primary group-hover:translate-y-0.5 transition-transform">
                                        <Icon icon="solar:download-minimalistic-bold" class="text-xl" />
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-sm text-gray-400 italic">
                                No illustrative files attached to this job post.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-1/4 flex flex-col gap-10">
                    <div class="flex flex-col gap-3">
                        <router-link :to="`/job/${job?.id}/submit_proposal`"
                            class="py-2.5 bg-primary hover:bg-opacity-90 transition border border-primary rounded-full text-white font-semibold text-center shadow-sm">
                            Apply now
                        </router-link>
                        <button
                            @click="toggleSave"
                            :disabled="isSaving"
                            type="button"
                            class="py-2.5 flex items-center justify-center gap-2 border rounded-full font-semibold text-center transition-all cursor-pointer"
                            :class="isSaved ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100' : 'border-primary text-primary hover:bg-primary/10'"
                        >
                            <LoadingSpinner v-if="isSaving" class="w-5 h-5 text-current" />
                            <template v-else>
                                <Icon :icon="isSaved ? 'solar:heart-bold' : 'solar:heart-linear'" class="text-xl" />
                                <div class="text-base">{{ isSaved ? 'Saved' : 'Save job' }}</div>
                            </template>
                        </button>
                    </div>

                    <!-- Dynamic About the Client section -->
                    <div class="flex flex-col gap-6 p-6 border rounded-2xl bg-gray-50/50">
                        <div class="text-xl font-bold text-gray-900 border-b pb-3">About the client</div>
                        <div class="flex flex-col gap-4">
                            <!-- Client Avatar & Name -->
                            <div class="flex items-center gap-3">
                                <img
                                    :src="job?.user?.profile_picture || DEFAULT_PROFILE_PICTURE"
                                    alt="client avatar"
                                    class="w-12 h-12 rounded-full object-cover border border-gray-200"
                                />
                                <div class="flex flex-col truncate">
                                    <span class="font-semibold text-gray-900 text-base truncate">
                                        {{ clientDisplayName }}
                                    </span>
                                    <span class="text-xs text-gray-500">Client</span>
                                </div>
                            </div>

                            <!-- Location -->
                            <div class="flex items-start gap-2.5 text-sm text-gray-700">
                                <Icon icon="solar:map-point-bold" class="text-lg text-gray-400 shrink-0 mt-0.5" />
                                <div class="flex flex-col">
                                    <span class="font-medium">{{ job?.user?.country || 'Location not specified' }}</span>
                                    <span class="text-xs text-gray-400">Location</span>
                                </div>
                            </div>

                            <!-- Jobs Posted -->
                            <div class="flex items-start gap-2.5 text-sm text-gray-700">
                                <Icon icon="solar:document-text-bold" class="text-lg text-gray-400 shrink-0 mt-0.5" />
                                <div class="flex flex-col">
                                    <span class="font-medium">{{ job?.user?.job_posts_count ?? 1 }} jobs posted</span>
                                    <span class="text-xs text-gray-400">Activity on NovaLance</span>
                                </div>
                            </div>

                            <!-- Member Since -->
                            <div class="flex items-start gap-2.5 text-sm text-gray-700" v-if="job?.user?.created_at">
                                <Icon icon="solar:calendar-bold" class="text-lg text-gray-400 shrink-0 mt-0.5" />
                                <div class="flex flex-col">
                                    <span class="font-medium">Member since {{ formatMemberSince(job?.user?.created_at) }}</span>
                                    <span class="text-xs text-gray-400">Joined</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="!isLoading && job === null" class="w-full py-24 flex flex-col items-center justify-center text-center">
        <h2 class="text-xl font-bold text-gray-700">Job Not Found</h2>
        <p class="text-gray-500 mt-2">The requested job post could not be found or has been removed.</p>
        <router-link to="/home" class="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-opacity-90">
            Back to Home
        </router-link>
    </div>
</template>

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestClientJobs from "@/libs/RestClientJobs";
import RestProposals from "@/libs/RestProposals";
import RestSavedJobs from "@/libs/RestSavedJobs";
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import type ToastsManager from "@/libs/ToastsManager";
import { inject, ref, computed, type Ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosInstance } from 'axios';
import moment from 'moment';

const isLoading = ref(true);
const isSent = ref(false);
const isSaved = ref(false);
const isSaving = ref(false);
const route = useRoute();
const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>('toastManager');
const restClientJobs = new RestClientJobs(axios!);
const restProposals = new RestProposals(axios!);
const restSavedJobs = new RestSavedJobs(axios!);
const job = ref<JobPost | null>(null);

try {
    const getJobByIdResult = await restClientJobs.getById(Number(route.params.id));
    if (getJobByIdResult.isSuccess()) {
        job.value = getJobByIdResult.value!;
        isSaved.value = !!job.value?.is_saved;
    }
} catch (error) {
    console.error("Failed to load job details:", error);
} finally {
    isLoading.value = false;
}

try {
    const getProposalByJobIdResult = await restProposals.getProposalByJobId(Number(route.params.id));
    if (getProposalByJobIdResult.isSuccess()) {
        console.log("result:", getProposalByJobIdResult.value);
        isSent.value = true;
    }
} catch (error) {
    console.log({ error });
    isSent.value = false;
}

const clientDisplayName = computed(() => {
    if (!job.value?.user) return 'Client';
    const u = job.value.user;
    if (u.first_name && u.last_name) {
        return `${u.first_name} ${u.last_name}`;
    }
    return u.username || 'Client';
});

const formatMemberSince = (date?: string): string => {
    if (!date) return '';
    return moment(date).format('MMM YYYY');
};

const toggleSave = async () => {
    if (!job.value?.id || isSaving.value) return;
    isSaving.value = true;
    try {
        const res = await restSavedJobs.toggleSave(job.value.id);
        if (res.isSuccess()) {
            isSaved.value = res.value!.saved;
            if (isSaved.value) {
                toastManager?.value?.alertSuccess('Job saved to your list!');
            } else {
                toastManager?.value?.alertSuccess('Job removed from saved jobs.');
            }
        } else {
            toastManager?.value?.alertError(res.error || 'Failed to update saved job.');
        }
    } catch (err: any) {
        toastManager?.value?.alertError(err?.message || 'Failed to update saved job.');
    } finally {
        isSaving.value = false;
    }
};

const formatDate = (date?: string): string => moment(date).fromNow();

const isImageFile = (filePath?: string): boolean => {
    if (!filePath) return false;
    return /\.(jpg|jpeg|png|webp|gif|svg|avif)($|\?)/i.test(filePath);
};

const isFileValid = (filePath?: string): boolean => {
    if (!filePath) return false;
    const trimmed = filePath.trim();
    return trimmed !== '' && trimmed !== 'file.pdf';
};

const getFileUrl = (filePath?: string): string => {
    if (!filePath) return '';
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
        return filePath;
    }
    if (filePath.startsWith('/')) {
        return filePath;
    }
    return `/${filePath}`;
};

const getFileName = (filePath?: string): string => {
    if (!filePath) return 'attachment';
    const parts = filePath.split('/');
    let name = parts[parts.length - 1];
    name = name.replace(/^\d+_file_/, '');
    return decodeURIComponent(name) || 'attachment';
};

const downloadFile = async (filePath?: string) => {
    if (!filePath) return;
    const url = getFileUrl(filePath);
    const fileName = getFileName(filePath);
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error fetching file');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
</script>
