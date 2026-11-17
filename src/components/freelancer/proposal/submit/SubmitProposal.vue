<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <div class="w-11/12 flex flex-col gap-16">
            <FreeLancerHeaderVue target="profile" />
            <div class="flex flex-col gap-12">
                <div class="flex flex-col gap-2">
                    <div class="text-2xl font-semibold text-black">Submit a Proposal</div>
                    <div class="text-base text-gray-400">Fill the details about your Proposal</div>
                </div>
                <form @submit.prevent="submitForm" class="flex flex-col gap-8">
                    <div class="flex flex-col border rounded-3xl">
                        <div class="flex gap-4 p-8">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">Job Details</div>
                            </div>
                            <div class="w-4/5 flex items-center gap-2">
                                <div class="flex flex-col gap-4">
                                    <div class="text-xl font-bold">{{ job?.title }}</div>
                                    <div class="text-gray-400">{{ moment(job?.created_at).fromNow() }}</div>
                                    <div>{{ job?.description }}</div>
                                    <div class="font-medium text-primary underline">more</div>
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
                                    <router-link :to="`/job/${job?.id}`" class="font-medium text-primary underline">View
                                        job posting</router-link>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-4 p-8 border-t">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">Skills and Expertise</div>
                                <div class="text-gray-400">List of the skills needed to complete this job.</div>
                            </div>
                            <div class="w-4/5 flex items-center gap-2">
                                <div class="flex items-center gap-3 flex-wrap">
                                    <div
                                        v-for="(category, index) in job?.categories"
                                        :key="index"
                                        class="py-2 px-4 bg-gray-200 rounded-full text-sm font-medium text-gray-800"
                                    >
                                        {{ getCategoryName(category) }}
                                    </div>
                                    <div v-if="!job?.categories || job.categories.length === 0" class="text-sm text-gray-400 italic">
                                        No specific skills listed.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-4 p-8 border-t">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">Bid</div>
                                <div class="text-gray-400">Total amount the client will see on your proposal</div>
                            </div>
                            <div class="w-4/5 flex flex-col gap-2">
                                <div class="w-full flex items-center gap-2">
                                    <div>$</div>
                                    <input placeholder="Enter a bid" type="number" :onfocus="() => formErrors.bid = ''"
                                        v-model="submitProposalForm.bid" :min="job?.budjet"
                                        :class="`flex-grow px-8 py-2 rounded-lg border bg-transparent ${formErrors.bid ? 'border-red-600' : 'border-black'}`">
                                </div>
                                <div class="text-red-600">{{ formErrors.bid }}</div>
                            </div>

                        </div>
                        <div class="flex gap-4 p-8">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">10% Freelancer Service Fee</div>
                            </div>
                            <div class="w-4/5 flex items-center gap-2 text-gray-600">
                                <div>$</div>
                                <input type="number" :value="fee"
                                    class="flex-grow px-8 py-2 rounded-lg border bg-gray-100 border-none outline-none">
                            </div>
                        </div>
                        <div class="flex gap-4 p-8">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">You'll Receive</div>
                                <div class="text-gray-400">The estimated amount you'll receive after service fees.</div>
                            </div>
                            <div class="w-4/5 flex items-center gap-2">
                                <div>$</div>
                                <div>{{ submitProposalForm.bid - fee }}</div>
                            </div>
                        </div>
                        <div class="flex gap-4 p-8 border-t">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">How long will this project take?</div>
                            </div>
                            <div class="w-4/5 flex flex-col gap-2">
                                <select :onfocus="() => formErrors.duration = ''" v-model="submitProposalForm.duration"
                                    :class="`flex-grow px-8 py-2 rounded-lg border bg-transparent ${formErrors.duration ? 'border-red-600' : 'border-black'}`">
                                    <option disabled selected value="">Select a duration</option>
                                    <option v-for="duration in DURATION_LIST" :value="duration">{{ duration }}</option>
                                </select>
                                <div class="text-red-600">{{ formErrors.duration }}</div>
                            </div>
                        </div>
                        <div class="flex gap-4 p-8 border-t">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">Cover Letter</div>
                            </div>
                            <div class="w-4/5 flex flex-col gap-2">
                                <textarea :onfocus="() => formErrors.cover_letter = ''"
                                    v-model="submitProposalForm.cover_letter"
                                    :class="`flex-grow px-8 py-2 rounded-lg border bg-transparent ${formErrors.cover_letter ? 'border-red-600' : 'border-black'}`"
                                    rows="6" placeholder="Enter a Cover Letter" type="number"
                                    class="flex-grow px-8 py-2 rounded-lg border border-black bg-transparent"></textarea>
                                <div class="text-red-600">{{ formErrors.cover_letter }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-if="formErrors.api" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
                        {{ formErrors.api }}
                    </div>

                    <div class="flex items-center justify-end gap-4">
                        <router-link
                            :to="`/job/${job?.id}`"
                            class="cursor-pointer text-gray-700 hover:text-black font-semibold rounded-full px-8 py-2.5 transition"
                        >
                            Cancel
                        </router-link>
                        <div v-if="isFormLoading" class="flex items-center gap-2 px-8 py-2.5 bg-primary/20 text-primary rounded-full font-semibold">
                            <LoadingSpinner class="w-5 h-5 text-primary" />
                            <div>Submitting...</div>
                        </div>
                        <button
                            type="submit"
                            v-else
                            class="cursor-pointer bg-primary hover:bg-opacity-90 text-white font-semibold rounded-full px-12 py-2.5 transition shadow-sm"
                        >
                            Send Proposal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { DURATION_LIST } from '@/consts';
import RestClientJobs from "@/libs/RestClientJobs";
import RestProposals from '@/libs/RestProposals';
import type ToastsManager from "@/libs/ToastsManager";
import type { AxiosInstance } from 'axios';
import moment from 'moment';
import { inject, ref, computed, reactive, type Ref } from "vue";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const axios = inject<AxiosInstance>('axios');
const toastManager = inject<Ref<ToastsManager>>('toastManager');
const restClientJobs = new RestClientJobs(axios!);
const restProposals = new RestProposals(axios!);
const isFormLoading = ref(false);
const job = ref<JobPost | null>(null);

const submitProposalForm = reactive({
    bid: 0,
    duration: "",
    cover_letter: "",
});

const formErrors = reactive({
    bid: "",
    duration: "",
    cover_letter: "",
    job_post_id: "",
    api: "",
});

const fee = computed(() => Number(submitProposalForm.bid || 0) * 0.1);

const getCategoryName = (cat: any): string => {
    if (!cat) return '';
    if (typeof cat === 'object') {
        return cat.name || '';
    }
    return String(cat);
};

try {
    const response = await restClientJobs.getById(Number(route.params.id));
    if (response.isSuccess()) {
        job.value = response.value!;
        if (job.value.budjet && submitProposalForm.bid === 0) {
            submitProposalForm.bid = Number(job.value.budjet);
        }
    }
} catch (error) {
    console.error("Failed to load job details:", error);
}

async function submitForm() {
    formErrors.bid = "";
    formErrors.duration = "";
    formErrors.cover_letter = "";
    formErrors.api = "";

    if (!submitProposalForm.bid || Number(submitProposalForm.bid) <= 0) {
        formErrors.bid = "Bid must be greater than 0.";
    }

    if (!submitProposalForm.duration || submitProposalForm.duration.trim().length === 0) {
        formErrors.duration = "Duration is required.";
    }

    if (!submitProposalForm.cover_letter || submitProposalForm.cover_letter.trim().length === 0) {
        formErrors.cover_letter = "Cover Letter is required.";
    }

    const hasErrors = formErrors.bid || formErrors.duration || formErrors.cover_letter;
    if (hasErrors) {
        return;
    }

    isFormLoading.value = true;
    try {
        const result = await restProposals.create({
            bid: Number(submitProposalForm.bid),
            cover_letter: submitProposalForm.cover_letter,
            duration: submitProposalForm.duration as Duration,
            job_post_id: Number(job.value?.id || route.params.id),
        });

        if (result.isFailure()) {
            formErrors.api = result.error!;
            toastManager?.value?.alertError(result.error || 'Failed to submit proposal.');
        } else {
            toastManager?.value?.alertSuccess('Proposal submitted successfully!');
            router.push('/proposals');
        }
    } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || 'Failed to submit proposal.';
        formErrors.api = errorMsg;
        toastManager?.value?.alertError(errorMsg);
    } finally {
        isFormLoading.value = false;
    }
}
</script>