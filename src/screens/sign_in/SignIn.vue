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
                        <div class="text-sm font-semibold">Password</div>
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
    </div>
</template>

<script lang="ts" setup>
import RestUserSession from "@/libs/RestUserSession";
import ToastsManager from "@/libs/ToastsManager";
import UserSessionRepository from "@/libs/UserSessionRepository";
import axios from "axios";
import { inject, ref, type Ref } from "vue";

let toastManager = inject<Ref<ToastsManager>>("toastManager");
const isLoading = ref(false);
const restUserSession = new RestUserSession(axios!);
const userSessionRepository = new UserSessionRepository(localStorage);

const email = ref('');
const password = ref('');

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