<template>
    <div class="w-full flex flex-col items-center border-t-2 border-gray-200">
        <div class="w-full relative flex flex-col py-4">
            <div @click="menu"
                class="absolute grid place-content-center hover:text-white p-5 w-1 h-1 cursor-pointer transition-colors duration-200 rounded-full hover:bg-primary top-5 right-5"
                v-if="account_type == 'client'">
                <Icon icon="charm:menu-kebab" :class="[colors.text]" />
            </div>
            <div v-motion-pop-visible class="py-5 px-2 w-44 h-40 bg-white shadow-md absolute top-10 right-14"
                v-if="menuValue">
                <ul>
                    <router-link :to="'/update_job/' + job?.id"
                        class="flex items-center mb-2 p-2 transition-colors duration-300 rounded-lg hover:bg-violet-100 hover:bg-opacity-75 cursor-pointer">
                        <Icon class="text-regal-purple" icon="basil:edit-solid" />
                        <span>Edit job post</span>
                    </router-link>
                    <li @click="deleteJob"
                        class="flex items-center mb-2 p-2 transition-colors duration-300 rounded-lg hover:bg-violet-100 hover:bg-opacity-75 cursor-pointer">
                        <Icon class="text-regal-purple" icon="material-symbols:delete" />
                        <span>Delete job post</span>
                    </li>
                </ul>
            </div>
            <div class="w-full flex flex-col gap-8">
                <div class="w-full flex flex-col gap-4">
                    <div class="text-base text-gray-400 font-medium">Posted {{ job?.created_at.split('T')[0] }}
                    </div>
                    <div class="w-full flex flex-col gap-2">
                        <router-link :to="'/job/' + job?.id" class="text-2xl font-semibold cursor-pointer">{{
                            job?.title
                        }}</router-link>
                        <div class="text-base">
                            {{ job?.description.split(/\n|\r/)[0] }}
                        </div>
                    </div>
                    <router-link :to="'/job/' + job?.id"
                        class="underline font-bold text-primary cursor-pointer">more</router-link>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <div class="flex items-center gap-4">
                        <div class="text-sm">Price: </div>
                        <div class="text-sm text-green-600"> {{ job?.budjet }}$</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="text-sm">Proposals: </div>
                        <div class="text-sm"> 5 to 10</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue';
import RestClientJobs from "@/libs/RestClientJobs";
import UserSessionRepository from "@/libs/UserSessionRepository";
import type { AxiosInstance } from 'axios';

const emit = defineEmits();
const props = defineProps<{ job: JobPost; colors: Record<string, string>; }>();

const job = props.job;
const colors = props.colors;
const axios = inject<AxiosInstance>('axios');
const account_type = ref<AccountType | null>(null);
const userSessionRepository = new UserSessionRepository(localStorage);

onMounted(async () => {
    account_type.value = await userSessionRepository.getAccountType();
});

const menuValue = ref(false)
function menu() {
    menuValue.value = !menuValue.value
}

const deleteJob = async () => {
    let restClientJobs = new RestClientJobs(axios!)
    let response = await restClientJobs.delete(job.id)
    console.log("deleteJob:", response);
    emit('remove-job', job.id);
}

</script>