<template>
    <div class="h-screen w-full flex">
        <Loading v-if="isLoading" />
        <div class="w-1/2 h-full bg-gray-300 hidden md:block overflow-hidden">
            <img src="@/assets/signin.png" class="w-full h-full object-cover">
        </div>
        <div class="w-full md:w-1/2 h-full flex items-center justify-center bg-white">
            <div class="flex flex-col gap-8 w-full mx-8 md:mx-16 lg:mx-32">
                <div class="flex flex-col gap-2">
                    <div class="font-bold text-xl  md:text-3xl">Welcome to NovaLance</div>
                    <div class="opacity-50 text-xs">Sign In to your account</div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-2">
                        <div class="text-sm font-semibold">Email</div>
                        <input v-model="email"
                            class="bg-transparent border-gray-200 rounded-md placeholder:text-opacity-75 text-xs border p-2 w-full mx-auto outline-none"
                            type="email" placeholder="Enter your email" />
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center justify-between">
                            <div class="text-sm font-semibold">Password</div>
                            <button type="button" @click="openResetModal" class="text-xs text-primary hover:underline cursor-pointer">
                                Forgot password?
                            </button>
                        </div>
                        <input v-model="password"
                            class="bg-transparent border-gray-200 rounded-md placeholder:text-opacity-75 text-xs border p-2 w-full mx-auto outline-none"
                            type="password" placeholder="Enter your password" />
                    </div>
                </div>
                <div @click="signIn"
                    class="px-16 py-2 text-gray-50 font-semibold rounded-md bg-primary hover:bg-opacity-75 cursor-pointer text-sm w-full text-center mx-auto">
                    Sign In</div>
                <div class="text-xs flex gap-1 font-semibold">
                    <div>Don’t have an account?</div>
                    <a href="/sign_up" class="text-primary hover:text-opacity/50 cursor-pointer">Sign Up</a>
                </div>
            </div>
        </div>

        <!-- Reset Password Modal -->
        <div v-if="isResetModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="closeResetModal">
            <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">
                <div class="flex items-center justify-between pb-3 border-b">
                    <div>
                        <h3 class="text-lg font-bold text-gray-800">Reset Password</h3>
                        <p class="text-xs text-gray-500 mt-0.5">Enter your email and a new password</p>
                    </div>
                    <button @click="closeResetModal" class="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer">&times;</button>
                </div>

                <div v-if="resetErrors.general" class="p-3 bg-red-100 border border-red-300 text-red-700 rounded-xl text-xs">
                    {{ resetErrors.general }}
                </div>

                <div class="flex flex-col gap-4">
                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-semibold text-gray-700">Account Email</label>
                        <input
                            type="email"
                            v-model="resetForm.email"
                            placeholder="Enter your account email"
                            :class="`border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary ${resetErrors.email ? 'border-red-500' : 'border-gray-300'}`"
                        />
                        <span v-if="resetErrors.email" class="text-xs text-red-500 font-medium">{{ resetErrors.email }}</span>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-semibold text-gray-700">New Password</label>
                        <input
                            type="password"
                            v-model="resetForm.password"
                            placeholder="Minimum 6 characters"
                            :class="`border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary ${resetErrors.password ? 'border-red-500' : 'border-gray-300'}`"
                        />
                        <span v-if="resetErrors.password" class="text-xs text-red-500 font-medium">{{ resetErrors.password }}</span>
                    </div>

                    <div class="flex flex-col gap-1">
                        <label class="text-xs font-semibold text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            v-model="resetForm.confirm_password"
                            placeholder="Re-type new password"
                            :class="`border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary ${resetErrors.confirm_password ? 'border-red-500' : 'border-gray-300'}`"
                        />
                        <span v-if="resetErrors.confirm_password" class="text-xs text-red-500 font-medium">{{ resetErrors.confirm_password }}</span>
                    </div>
                </div>

                <div class="flex items-center justify-end gap-3 pt-4 border-t">
                    <button
                        type="button"
                        @click="closeResetModal"
                        class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        @click="handleResetPassword"
                        :disabled="isResetLoading"
                        class="px-6 py-2 text-sm font-semibold text-white bg-primary hover:bg-opacity-90 rounded-xl disabled:opacity-50 cursor-pointer"
                    >
                        {{ isResetLoading ? 'Resetting...' : 'Reset Password' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import RestUserSession from "@/libs/RestUserSession";
import ToastsManager from "@/libs/ToastsManager";
import UserSessionRepository from "@/libs/UserSessionRepository";
import axios from "axios";
import { inject, reactive, ref, type Ref } from "vue";

let toastManager = inject<Ref<ToastsManager>>("toastManager");
const isLoading = ref(false);
const restUserSession = new RestUserSession(axios!);
const userSessionRepository = new UserSessionRepository(localStorage);

const email = ref('');
const password = ref('');

// Reset Password Modal State
const isResetModalOpen = ref(false);
const isResetLoading = ref(false);
const resetForm = reactive({
    email: '',
    password: '',
    confirm_password: '',
});
const resetErrors = reactive({
    email: '',
    password: '',
    confirm_password: '',
    general: '',
});

const openResetModal = () => {
    resetForm.email = email.value || '';
    resetForm.password = '';
    resetForm.confirm_password = '';
    resetErrors.email = '';
    resetErrors.password = '';
    resetErrors.confirm_password = '';
    resetErrors.general = '';
    isResetModalOpen.value = true;
};

const closeResetModal = () => {
    isResetModalOpen.value = false;
};

const handleResetPassword = async () => {
    resetErrors.email = '';
    resetErrors.password = '';
    resetErrors.confirm_password = '';
    resetErrors.general = '';

    if (!resetForm.email?.trim()) {
        resetErrors.email = 'Email is required.';
    }
    if (!resetForm.password || resetForm.password.length < 6) {
        resetErrors.password = 'Password must be at least 6 characters.';
    }
    if (resetForm.password !== resetForm.confirm_password) {
        resetErrors.confirm_password = 'Passwords do not match.';
    }

    if (resetErrors.email || resetErrors.password || resetErrors.confirm_password) {
        return;
    }

    try {
        isResetLoading.value = true;
        const res = await restUserSession.resetPassword({
            email: resetForm.email,
            password: resetForm.password,
            confirm_password: resetForm.confirm_password,
        });

        if (res.isSuccess()) {
            toastManager?.value.alertSuccess(res.value || 'Password reset successfully.');
            email.value = resetForm.email;
            password.value = resetForm.password;
            closeResetModal();
        } else {
            const err = res.error || 'Failed to reset password.';
            if (err.toLowerCase().includes('email')) {
                resetErrors.email = err;
            } else if (err.toLowerCase().includes('match')) {
                resetErrors.confirm_password = err;
            } else {
                resetErrors.general = err;
            }
            toastManager?.value.alertError(err);
        }
    } catch (e: any) {
        const msg = e.response?.data?.error || e.message || 'Failed to reset password.';
        resetErrors.general = msg;
        toastManager?.value.alertError(msg);
    } finally {
        isResetLoading.value = false;
    }
};

const handleErrorMessage = (error: string) => {
    toastManager?.value.alertError(error);
}

const signIn = () => {
    isLoading.value = true;
    restUserSession.login({
        email: email.value,
        password: password.value
    }).then(response => {
        isLoading.value = false;
        console.log(response);
        if (response.isSuccess()) {
            userSessionRepository.save({ access_token: response.value!.access_token, account_type: response.value!.account_type });
            toastManager?.value.alertSuccess("Sign in successfuly.");
            setTimeout(() => {
                location.href = "/home";
            }, 3000);
        }
    }).catch(error => {
        isLoading.value = false;
        console.log(error);
        handleErrorMessage('Bad credentials');
    });
}
</script>