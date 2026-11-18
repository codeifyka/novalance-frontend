import { FreeLancerHeaderVue } from '@/components/freelancer/header';
import RestUserSession from '@/libs/RestUserSession';
import type ToastsManager from '@/libs/ToastsManager';
import type { AxiosInstance } from 'axios';
import { inject, onMounted, reactive, ref, type Ref } from 'vue';

export default {
    components: { FreeLancerHeaderVue },
    setup() {
        const axios = inject<AxiosInstance>("axios");
        const toastManager = inject<Ref<ToastsManager>>("toastManager");
        let user = ref<User | null>(null);
        const isLoading = ref(false);

        // Form errors
        const errors = reactive({
            username: "",
            email: "",
            first_name: "",
            last_name: "",
            telephone: "",
            country: "",
            gender: "",
            general: "",
        });

        // Avatar upload state
        const avatarInputRef = ref<HTMLInputElement>();
        const isAvatarLoading = ref(false);

        const triggerAvatarSelect = () => {
            avatarInputRef.value?.click();
        };

        const onAvatarSelected = async (event: Event) => {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                toastManager?.value.alertError('Please select a valid image file.');
                target.value = '';
                return;
            }

            try {
                isAvatarLoading.value = true;
                const restUserSession = new RestUserSession(axios!);
                const res = await restUserSession.uploadProfilePicture(file);

                if (res.isSuccess()) {
                    if (user.value) {
                        user.value.profile_picture = res.value!.profile_picture;
                    }
                    toastManager?.value.alertSuccess('Profile picture updated successfully.');
                } else {
                    toastManager?.value.alertError(res.error || 'Failed to upload profile picture.');
                }
            } catch (err: any) {
                toastManager?.value.alertError(err.message || 'Failed to upload profile picture.');
            } finally {
                isAvatarLoading.value = false;
                target.value = '';
            }
        };

        // Password change modal state
        const isPasswordModalOpen = ref(false);
        const isPasswordLoading = ref(false);
        const passwordForm = reactive({
            current_password: "",
            new_password: "",
            confirm_password: "",
        });
        const passwordErrors = reactive({
            current_password: "",
            new_password: "",
            confirm_password: "",
            general: "",
        });

        const clearErrors = () => {
            errors.username = "";
            errors.email = "";
            errors.first_name = "";
            errors.last_name = "";
            errors.telephone = "";
            errors.country = "";
            errors.gender = "";
            errors.general = "";
        };


        onMounted(async () => {
            let restUserSession = new RestUserSession(axios!);
            const info = await restUserSession.getInfo();
            if (info.isSuccess() && info.value?.user) {
                user.value = info.value.user;
            }
        });

        const save = async () => {
            clearErrors();
            if (!user.value) return;

            if (!user.value.username?.trim()) {
                errors.username = "Username is required.";
            }

            if (errors.username) {
                toastManager?.value.alertError("Please fix the errors in the form.");
                return;
            }

            try {
                isLoading.value = true;
                let restUserSession = new RestUserSession(axios!);
                let response = await restUserSession.updateUserInfo(user.value!);
                console.log(response);

                if (response.isSuccess()) {
                    toastManager?.value.alertSuccess('User info changed successfully.');
                    user.value = response.value!;
                } else {
                    const err = response.error || 'Something went wrong!';
                    if (err.toLowerCase().includes("username")) {
                        errors.username = err;
                    } else if (err.toLowerCase().includes("email")) {
                        errors.email = err;
                    } else {
                        errors.general = err;
                    }
                    toastManager?.value.alertError(err);
                }
            } catch (e: any) {
                const msg = e.response?.data?.error || e.message || 'Something went wrong!';
                errors.general = msg;
                toastManager?.value.alertError(msg);
            } finally {
                isLoading.value = false;
            }
        };

        const openPasswordModal = () => {
            passwordForm.current_password = "";
            passwordForm.new_password = "";
            passwordForm.confirm_password = "";
            passwordErrors.current_password = "";
            passwordErrors.new_password = "";
            passwordErrors.confirm_password = "";
            passwordErrors.general = "";
            isPasswordModalOpen.value = true;
        };

        const closePasswordModal = () => {
            isPasswordModalOpen.value = false;
        };

        const changePassword = async () => {
            passwordErrors.current_password = "";
            passwordErrors.new_password = "";
            passwordErrors.confirm_password = "";
            passwordErrors.general = "";

            if (!passwordForm.current_password) {
                passwordErrors.current_password = "Current password is required.";
            }
            if (!passwordForm.new_password || passwordForm.new_password.length < 6) {
                passwordErrors.new_password = "New password must be at least 6 characters.";
            }
            if (passwordForm.new_password !== passwordForm.confirm_password) {
                passwordErrors.confirm_password = "Passwords do not match.";
            }

            if (passwordErrors.current_password || passwordErrors.new_password || passwordErrors.confirm_password) {
                return;
            }

            try {
                isPasswordLoading.value = true;
                let restUserSession = new RestUserSession(axios!);
                let response = await restUserSession.changePassword(passwordForm);

                if (response.isSuccess()) {
                    toastManager?.value.alertSuccess("Password updated successfully.");
                    closePasswordModal();
                } else {
                    const err = response.error || "Failed to update password";
                    if (err.toLowerCase().includes("current password")) {
                        passwordErrors.current_password = err;
                    } else if (err.toLowerCase().includes("match")) {
                        passwordErrors.confirm_password = err;
                    } else {
                        passwordErrors.general = err;
                    }
                    toastManager?.value.alertError(err);
                }
            } catch (e: any) {
                const msg = e.response?.data?.error || e.message || "Failed to update password";
                passwordErrors.general = msg;
                toastManager?.value.alertError(msg);
            } finally {
                isPasswordLoading.value = false;
            }
        };

        return {
            user,
            save,
            isLoading,
            errors,
            isPasswordModalOpen,
            isPasswordLoading,
            passwordForm,
            passwordErrors,
            openPasswordModal,
            closePasswordModal,
            changePassword,
            avatarInputRef,
            isAvatarLoading,
            triggerAvatarSelect,
            onAvatarSelected,
        };
    }
}
