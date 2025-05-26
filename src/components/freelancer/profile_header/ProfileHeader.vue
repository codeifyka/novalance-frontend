<template>
    <div class="w-11/12 flex flex-col items-center gap-16">
        <FreeLancerHeaderVue :target="target" />
        <div class="w-full flex items-start justify-between">
            <div class="flex items-center gap-4">
                <div class="w-20 h-20 rounded-full">
                    <img :src="DEFAULT_PROFILE_PICTURE" alt="profile picture"
                        class="w-full h-full rounded-full object-cover">
                </div>
                <div class="flex flex-col">
                    <div class="text-xl font-semibold capitalize">{{ user_info?.user.first_name }}
                        {{ user_info?.user.last_name }}</div>
                    <div class="text-gray-400">@{{ user_info?.user.username }}
                        {{ user_info?.user.last_name }}</div>
                </div>
            </div>
            <a :href="target == 'portfolio' ? '/create_project' : '/create_service'"
                class="text-white bg-primary rounded-full px-16 py-2 font-medium cursor-pointer hover:bg-purple">
                {{ target == "portfolio" ? "Create Project" : "Create Service" }}</a>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import { inject } from 'vue';

const props = defineProps<{ target: string; }>();
const target = props.target;
const user_info = inject<UserInfo>('user_info');
</script>