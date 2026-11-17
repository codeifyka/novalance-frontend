<template>
    <div class="w-full flex items-center justify-between">
        <a href="/home" class="flex items-center text-black text-2xl font-bold">
            <img src="/logo.png" class="mr-2 h-8 object-contain rounded-full" alt="NovaLance logo">
            <span>NovaLance</span>
        </a>
        <div class="flex items-center gap-16">
            <a href="/chat_client_freelancer" class="text-black text-base flex items-center gap-2">
                <Icon icon="teenyicons:chat-outline" class="h-4 w-4 object-contain" />
                <div class="ml-1">Messages</div>
            </a>
            <a href="/services"
                :class="`text-base flex items-center gap-2 ${target == 'services' ? 'text-primary font-medium' : 'text-black'}`">
                <Icon icon="icons8:services" class="h-4 w-4 object-contain" />
                <div>My Services</div>
            </a>
            <a href="/portfolio"
                :class="`text-base flex items-center gap-2 ${target == 'portfolio' ? 'text-primary font-medium' : 'text-black'}`">
                <Icon icon="bytesize:portfolio" class="h-4 w-4 object-contain" />
                <div class="ml-1">My Projects</div>
            </a>
            <a href="/saved_jobs"
                :class="`text-base flex items-center gap-2 ${target == 'saved_jobs' ? 'text-primary font-medium' : 'text-black'}`">
                <Icon icon="solar:bookmark-linear" class="h-4 w-4 object-contain" />
                <div class="ml-1">Saved Jobs</div>
            </a>
            <div class="flex items-center gap-2">
                <Icon icon="material-symbols:notifications" class="h-4 w-4 object-contain" />
                <a href="/profile" class="w-6 h-6 rounded-full block cursor-pointer" title="View Profile">
                    <img class="w-full h-full rounded-full object-cover" :src="userInfo?.user?.profile_picture || DEFAULT_PROFILE_PICTURE"
                        alt="profile picture">
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import { inject } from 'vue';

const props = defineProps<{ target: string }>();
const target = props.target;
const userInfo = inject<{ user: User } | null>('user_info', null);
</script>
