<template>
    <div :class="['h-screen', 'w-full', 'flex', isAccountTypeSelected ? 'hidden' : '']">
        <Loading v-if="isLoading" />
        <div class="w-1/2 h-full bg-gray-300 hidden md:block overflow-hidden">
            <img src="@/assets/signup.png" class="w-full h-full object-cover">
        </div>
        <div class="w-full md:w-1/2 h-full flex items-center justify-center bg-white">
            <div class="flex flex-col gap-4 items-center w-full mx-8 md:mx-16 lg:mx-32">
                <div class="flex flex-col gap-2">
                    <div class="font-bold text-xl md:text-3xl">Join as Client Or FreeLancer</div>
                    <div class="opacity-50 text-xs">Create an accunt in our platform</div>
                </div>
                <div @click="setAccountType('client')"
                    class="px-16 py-2 text-gray-50 font-semibold rounded-md bg-primary hover:bg-opacity-75 cursor-pointer text-sm w-full text-center mx-auto">
                    Client</div>
                <div>Or</div>
                <div @click="setAccountType('freelancer')"
                    class="px-16 py-2 text-gray-50 font-semibold rounded-md bg-primary hover:bg-opacity-75 cursor-pointer text-sm w-full text-center mx-auto">
                    Free Lancer</div>
                <div class="text-xs flex gap-1 font-semibold">
                    <div>Already have an account?</div>
                    <a href="/sign_in" class="text-primary hover:text-opacity/50 cursor-pointer">Sign In</a>
                </div>
            </div>
        </div>
    </div>

    <div :class="['h-screen', 'w-full', 'flex', isAccountTypeSelected ? '' : 'hidden']">
        <Loading v-if="isLoading" />
        <div class="w-1/2 h-full bg-gray-300 hidden md:block overflow-hidden">
            <img src="@/assets/signup.png" class="w-full h-full object-cover">
        </div>
        <div class="w-full md:w-1/2 h-full flex items-center justify-center bg-white">
            <div class="flex flex-col gap-8 w-full mx-8 md:mx-16 lg:mx-32">
                <div class="flex flex-col gap-2">
                    <div class="font-bold text-xl  md:text-3xl">Welcome to NovaLance</div>
                    <div class="opacity-50 text-xs">Register your account</div>
                </div>
                <div class="flex flex-col gap-4">
                    <div class="flex md:flex-row md:gap-4 flex-col gap-4 md:items-center">
                        <div class="flex-1 flex gap-2 flex-col">
                            <div class="text-sm font-semibold">First Name</div>
                            <input v-model="first_name"
                                class="bg-transparent border-gray-200 rounded-md placeholder:text-opacity-75 text-xs border p-2 w-full mx-auto outline-none"
                                type="text" placeholder="Enter your First Name" />
                        </div>
                        <div class="flex-1 flex flex-col gap-2">
                            <div class="text-sm font-semibold">Last Name</div>
                            <input v-model="last_name"
                                class="bg-transparent border-gray-200 rounded-md placeholder:text-opacity-75 text-xs border p-2 w-full mx-auto outline-none"
                                type="email" placeholder="Enter your Last Name" />
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-sm font-semibold">Username</div>
                        <input v-model="username"
                            class="bg-transparent border-gray-200 rounded-md placeholder:text-opacity-75 text-xs border p-2 w-full mx-auto outline-none"
                            type="text" placeholder="Enter your username" />
                    </div>
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
                <div @click="signUp"
                    class="px-16 py-2 text-gray-50 font-semibold rounded-md bg-primary hover:bg-opacity-75 cursor-pointer text-sm w-full text-center mx-auto">
                    Sign Up</div>
                <div class="text-xs flex gap-1 font-semibold">
                    <div>Already have an account?</div>
                    <a href="/sign_in" class="text-primary hover:text-opacity/50 cursor-pointer">Sign In</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import RestUserSession from "@/libs/RestUserSession";
import type ToastsManager from "@/libs/ToastsManager";
import axios from "axios";
import { inject, ref, type Ref } from "vue";

let toastManager = inject<Ref<ToastsManager>>("toastManager");

const isLoading = ref(false);
const restUserSession = new RestUserSession(axios!);
const isAccountTypeSelected = ref(false);
const username = ref('');
const first_name = ref('');
const last_name = ref('');
const email = ref('');
const account_type = ref<AccountType>('freelancer');
const password = ref('');

const handleErrorMessage = (error: Record<string, string>) => {
    let keys = Object.keys(error);
    let t = 0;
    for (let key of keys) {
        setTimeout(() => {
            toastManager?.value.alertError(`${error[key]}`);
        }, t);
        t += 300;
    }
}

const signUp = () => {
    isLoading.value = true;
    restUserSession.register({
        username: username.value,
        first_name: first_name.value,
        last_name: last_name.value,
        account_type: account_type.value,
        email: email.value,
        password: password.value,
        confirm_password: password.value,
    }).then(response => {
        isLoading.value = false;
        if (response.isFailure()) {
            handleErrorMessage(response.error!);
        } else {
            toastManager?.value.alertSuccess("Sign up successfuly.");
            location.href = "/sign_in";
        }
    }).catch(error => {
        isLoading.value = false;
        console.log(error);
        alert('Bad credentials');
    });
}

const setAccountType = (accountType: AccountType) => {
    isAccountTypeSelected.value = true;
    account_type.value = accountType;
}
</script>