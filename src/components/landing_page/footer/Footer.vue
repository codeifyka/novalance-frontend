<template>
    <footer class="w-full flex flex-col rounded-t-2xl gap-4 bg-purple text-white justify-around py-2 px-4 lg:px-24">
        <div class="flex flex-col lg:flex-row gap-4 lg:items-start items-center-center lg:justify-between py-4">
            <div class="flex flex-col items-center lg:items-start gap-2">
                <h1 class="text-lg lg:text-lg text-white mb-2">About the site</H1>
                <a href="#"
                    class="text-sm text-gray-300 hover:underline transition-opacity duration-300">Home</a>
                <a href="#"
                    class="text-sm text-gray-300 hover:underline transition-opacity duration-300">About us</a>
                <a href="#"
                    class="text-sm text-gray-300 hover:underline transition-opacity duration-300">Contact
                    us</a>
            </div>

            <div class="flex flex-col items-center">
                <h1 class="text-lg">Get in touch</h1>
                <div class="flex justify-around gap-4 mt-4">
                    <a href="#" class=" hover:opacity-100  transition-colors duration-350" v-for="icon in icons">
                        <Icon :icon="icon" width="24" height="24" class="text-white hover:text-white/50" />
                    </a>
                </div>
            </div>
        </div>
        <div>
            <h1 class="font-bold opacity-50 mt-4 text-sm text-center">© 2023 Novalance. All rights reserved.
            </h1>
        </div>
    </footer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const icons = ref(["mingcute:github-fill", "ri:facebook-fill", "ri:linkedin-fill"]);
</script>
