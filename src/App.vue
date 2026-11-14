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
import { provide, ref } from "vue";
import ToastsManager from "./libs/ToastsManager";
import RestUserSession from "./libs/RestUserSession";
import UserSessionRepository from "./libs/UserSessionRepository";
import setupAxios from "./libs/ProtectAPI";
import { useRouter } from "vue-router";
import axios from "axios";

// Load User Session
let userSessionRepository = new UserSessionRepository(localStorage);
let restUserSession = new RestUserSession(axios!);
let access_token = userSessionRepository.getAccessToken();

if (access_token) {
    try {
        let response = await restUserSession.checkAuth(access_token);
        if (response.isFailure()) {
            userSessionRepository.clear();
        } else {
            let authedAxios = setupAxios(access_token);
            provide('axios', authedAxios);
            try {
                const restAuthedSession = new RestUserSession(authedAxios);
                const getUserInfoResult = await restAuthedSession.getInfo();
                if (getUserInfoResult.isSuccess()) {
                    provide("user_info", getUserInfoResult.value);
                }
            } catch (err) {
                console.error("Failed to get user info:", err);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

const UNPROTECTED_ROUTES = ['/', '/sign_in', '/sign_up'];
const router = useRouter();
router.beforeEach(async (to) => {
    if (!UNPROTECTED_ROUTES.includes(to.path)) {
        if (!access_token) {
            return { path: '/sign_in' };
        }
    }
});

const toastManager = ref(new ToastsManager());
provide("toastManager", toastManager);

const toasts = toastManager?.value.toasts;

</script>
