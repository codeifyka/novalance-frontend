<template>
    <div class="w-full h-screen overflow-auto flex flex-col items-center py-4 gap-16">
        <Loading v-if="isLoading" />
        <div class="w-11/12 flex flex-col gap-16">
            <FreeLancerHeaderVue target="profile" />
            <div class="font-semibold text-3xl text-black">My Proposals</div>
            <div class="w-full flex flex-col">
                <div class="flex items-center gap-8 border-b-2">
                    <p class="cursor-pointer"
                        :class="{ 'text-primary font-bold border-primary border-b-2': status === 'active' }"
                        @click="changeSection('active')">
                        Active
                    </p>
                    <p class="hover:cursor-pointer"
                        :class="{ 'text-primary font-bold border-primary border-b-2': status === 'done' }"
                        @click="changeSection('done')">
                        Done
                    </p>
                    <p class="hover:cursor-pointer"
                        :class="{ 'text-primary font-bold border-primary border-b-2': status === 'pending' }"
                        @click="changeSection('pending')">
                        Pending
                    </p>
                </div>
                <ActiveVue v-if="status === 'active'" :proposals="activeProposals" />
                <PendingVue v-if="status === 'pending'" :proposals="pendingProposals" />
                <DoneVue v-if="status === 'done'" :proposals="doneProposals" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { inject, onMounted, ref } from 'vue';
import { DoneVue } from './done';
import { PendingVue } from './pending';
import { ActiveVue } from './active';
import RestProposals from '@/libs/RestProposals';
import type { AxiosInstance } from 'axios';

export default {
    components: { FreeLancerHeaderVue, DoneVue, PendingVue, ActiveVue },
    setup() {
        const axios = inject<AxiosInstance>("axios");
        const isLoading = ref(false);
        const status = ref('active');
        const restClientProposals = new RestProposals(axios!);
        const pendingProposals = ref<Proposal[]>([])
        const doneProposals = ref<Proposal[]>([])
        const activeProposals = ref<Proposal[]>([])

        onMounted(async () => {
            let response = await restClientProposals.getFreelancerProposals();
            if (response.isSuccess()) {
                pendingProposals.value = response.value!.filter(p => p.status === 'pending') || [];
                doneProposals.value = response.value!.filter(p => p.status === 'done') || [];
                activeProposals.value = response.value!.filter(p => p.status === 'active') || [];
            }
        });
        const changeSection = (statusValue: string) => {
            status.value = statusValue;
        };

        return {
            isLoading, changeSection, pendingProposals, doneProposals, activeProposals, status
        };
    }
}
</script>
