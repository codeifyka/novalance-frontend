<template>
    <div class="w-full min-h-screen">
        <RouterView v-slot="{ Component }">
            <template v-if="Component">
                <Suspense>
                    <component :is="Component"></component>

                    <template #fallback>
                        <Loading />
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
import RestNotifications from "./libs/RestNotifications";
import UserSessionRepository from "./libs/UserSessionRepository";
import setupAxios from "./libs/ProtectAPI";
import { getEcho } from "./libs/EchoService";
import { useRouter } from "vue-router";
import axios from "axios";

// Toasts Manager setup
const toastManager = ref(new ToastsManager());
provide("toastManager", toastManager);
const toasts = toastManager.value.toasts;

// Shared Notifications State
const notificationsState = ref({
    notifications: [] as AppNotification[],
    unreadCount: 0,
    fetchNotifications: async () => {},
});
provide("notificationsState", notificationsState);

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
                if (getUserInfoResult.isSuccess() && getUserInfoResult.value) {
                    provide("user_info", getUserInfoResult.value);

                    const user = getUserInfoResult.value.user;

                    // Notifications Fetcher
                    const restNotifications = new RestNotifications(authedAxios);
                    notificationsState.value.fetchNotifications = async () => {
                        const notifRes = await restNotifications.getNotifications();
                        if (notifRes.isSuccess() && notifRes.value) {
                            notificationsState.value.notifications = notifRes.value.notifications || [];
                            notificationsState.value.unreadCount = notifRes.value.unread_count || 0;
                        }
                    };

                    // Load initial notifications
                    await notificationsState.value.fetchNotifications();

                    // Connect Laravel Echo via Reverb & listen on user private channel
                    try {
                        const echo = getEcho(access_token);
                        echo.private(`App.Models.User.${user.id}`)
                            .notification((notification: any) => {
                                console.log('[Echo] Real-time notification received:', notification);

                                // 1. Trigger ToastsManager alert
                                const isPurchase = notification.type === 'service_purchased' ||
                                                   String(notification.type || '').includes('ServicePurchasedNotification') ||
                                                   !!notification.purchase_id;

                                if (isPurchase) {
                                    toastManager.value.alertSuccess(notification.message || 'Service purchased!');
                                } else {
                                    toastManager.value.alertInfo(notification.message || 'New notification!');
                                }

                                // 2. Update reactive notifications list & badge
                                const newNotif: AppNotification = {
                                    id: notification.id || String(Date.now()),
                                    type: notification.type || 'notification',
                                    notifiable_type: 'App\\Models\\User',
                                    notifiable_id: user.id,
                                    data: notification,
                                    read_at: null,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString(),
                                };

                                notificationsState.value.notifications.unshift(newNotif);
                                notificationsState.value.unreadCount += 1;
                            });
                    } catch (echoErr) {
                        console.error('[Echo] Failed to connect to Reverb:', echoErr);
                    }
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

</script>
