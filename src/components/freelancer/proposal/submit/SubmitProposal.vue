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
                        <div class="flex gap-4 p-8  border-t">
                            <div class="w-1/5 flex flex-col gap-4">
                                <div class="font-semibold text-black">Skills and Expertise</div>
                                <div class="text-gray-400">List of the skills needed to complete this job.</div>
                            </div>
                            <div class="w-4/5 flex items-center gap-2">
                                <div class="flex items-center gap-4">
                                    <div v-for="category in job?.categories" class="py-2 px-4 bg-gray-200 rounded-full">
                                        {{ category }}</div>
                                    <div class="py-2 px-4 bg-gray-200 rounded-full">TypeScript</div>
                                    <div class="py-2 px-4 bg-gray-200 rounded-full">NodeJS</div>
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
                    <div class="flex items-center justify-end gap-4">
                        <div class="cursor-pointer text-black font-semibold rounded-full px-16 py-2">Cancel</div>
                        <div v-if="isFormLoading" class="flex items-center gap-2">
                            <LoadingSpinner />
                            <div>Submiting...</div>
                        </div>
                        <button type="submit" v-if="!isFormLoading"
                            class="cursor-pointer bg-primary text-white font-semibold rounded-full px-16 py-2">Send</button>
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
import type { AxiosInstance } from 'axios';
import moment from 'moment';
import { inject, ref, computed, reactive } from "vue";
import { useRoute } from 'vue-router';

const fee = computed(() => submitProposalForm.bid * 0.1);
const route = useRoute();
const job = ref<JobPost | null>(null);
const axios = inject<AxiosInstance>('axios');
const restClientJobs = new RestClientJobs(axios!);
const restProposals = new RestProposals(axios!);
const isFormLoading = ref(false);

const submitProposalForm = reactive({
    bid: 0,
    duration: "",
    cover_letter: "",
    job_post_id: computed(() => job.value?.id).value,
});

const formErrors = reactive({
    bid: "",
    duration: "",
    cover_letter: "",
    job_post_id: "",
    api: "",
});

const response = await restClientJobs.getById(Number(route.params.id));
if (response.isSuccess()) {
    job.value = response.value!;
}

async function submitForm() {
    isFormLoading.value = true;
    await new Promise((res) => setTimeout(() => res({}), 3000));
    if (submitProposalForm.bid == 0) {
        formErrors.bid = "Bid must be greater than 0.";
    }

    if (submitProposalForm.duration.length == 0) {
        formErrors.duration = "Duration is required.";
    }

    if (submitProposalForm.cover_letter.length == 0) {
        formErrors.cover_letter = "Cover Letter is required.";
    }

    const isValidForm = Object.values(formErrors).filter(item => item.length > 0).length == 0;
    if (!isValidForm) {
        isFormLoading.value = false;
        return;
    }

    const result = await restProposals.create({
        bid: submitProposalForm.bid,
        cover_letter: submitProposalForm.cover_letter,
        duration: submitProposalForm.duration as Duration,
        job_post_id: job.value?.id || 0,
    });

    if (result.isFailure()) {
        formErrors.api = result.error!;
    }

    // TODO: Redirect to Proposal Page

    isFormLoading.value = false;
}

</script>