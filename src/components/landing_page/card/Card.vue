<template>
    <Motion Motion is="p" preset="slideVisibleLeft"
        class="group card hover:translate-y-[-10px] relative flex flex-col overflow-hidden items-center bg-white rounded-xl py-8 px-4 lg:w-60 mx-4 lg:mx-0 w-auto justify-center gap-4 hover:bg-purple hover:text-white transition-all duration-300">
        <Icon :icon="icon" height="75" class="text-purple group-hover:text-white transition-all duration-300" />
        <div class="text-purple text-lg  text-center group-hover:text-white transition-all duration-300">
            {{ title }}
        </div>
        <div class="text-center text-gray-400 text-sm group-hover:text-white/30 transition-all duration-300">
            {{ paragraph }}</div>
        <div
            class="bg-white/10 -z-0 hidden group-hover:flex w-72 h-72 absolute bottom-[55%] rounded-full  justify-center items-center">
            <div class="bg-white/5 w-40 h-40 rounded-full"></div>
        </div>
    </Motion>

</template>

<script lang="ts" setup>
const { icon, paragraph, title } = defineProps<{ icon: string, title: string; paragraph: string; }>();
</script>