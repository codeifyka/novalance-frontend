import logo from '@/assets/images/logo.png';
import RestUserSession from "@/libs/RestUserSession";
import { ref, inject, type Ref, onMounted } from 'vue'
import axios from "axios";
import type ToastsManager from '@/libs/ToastsManager';
export default {
    props: {
        isHomePath: Boolean
    },
    setup() {
        let toastManager = inject<Ref<ToastsManager>>("toastManager");
        let isShow = ref(false)
        let isShow2 = ref(false)
        const isLoading = ref(false);
        const restUserSession = new RestUserSession(axios!);
        const handleErrorMessage = (error: string) => {
            toastManager?.value.alertError(error);
        }
        const showMobileMenu = ref(false);
        let user = ref<User | null>(null);

        function toggleMenu() {
            showMobileMenu.value = !showMobileMenu.value;
        }

        onMounted(async () => {
            let restUserSession = new RestUserSession(axios!);
            user.value = (await restUserSession.getInfo()).value!.user;
        });

        const logout = () => {
            isLoading.value = true;
            restUserSession.logout().then(_ => {
                isLoading.value = false;
                location.href = "/";
            }).catch(error => {
                isLoading.value = false;
                console.log(error);
                handleErrorMessage('Bad credentials');
            });
        }
        return { logo, isShow, isShow2, logout, showMobileMenu, toggleMenu, user }
    }
}
