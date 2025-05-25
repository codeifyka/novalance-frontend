<template>
    <div class="w-full min-h-screen">
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <Suspense>
                    <component :is="Component"></component>

                    <template #fallback>
                        <div class="w-full h-screen flex flex-col items-center justify-center">
                            <div class="text-black">Loading...</div>
                        </div>
                    </template>
                </Suspense>
            </template>
        </RouterView>
        <Toast :toasts="toasts" />
    </div>
</template>

<script lang="ts" setup>
import { inject, provide, ref } from "vue";
import ToastsManager from "./libs/ToastsManager";
import type { AxiosInstance } from "axios";
import RestUserSession from "./libs/RestUserSession";

const toastManager = ref(new ToastsManager());
provide("toastManager", toastManager);

const axios = inject<AxiosInstance>("axios");

const restUserSession = new RestUserSession(axios!)
const getUserInfoResult = await restUserSession.getInfo();
if (getUserInfoResult.isSuccess()) {
    provide("user_info", getUserInfoResult.value);
}

const toasts = toastManager?.value.toasts;
</script>
