<template>
    <Suspense>
        <template #default>
            <App />
        </template>
        <template #fallback>
            <div class="w-full h-screen flex flex-col items-center justify-center">
                <div class="flex items-center gap-2">
                    <LoadingSpinnerVue />
                    <div>Loading App...</div>
                </div>
            </div>
        </template>
    </Suspense>
</template>

<script setup lang="ts">
import App from '../../App.vue';
import { LoadingSpinnerVue } from '../loading_spinner';
</script>
