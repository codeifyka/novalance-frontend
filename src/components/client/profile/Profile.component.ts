import { ClientHeaderVue } from "@/components/client/header";
import { ClientFooterVue } from "@/components/client/footer";
import RestUserSession from "@/libs/RestUserSession";
import { inject, onMounted, ref, type Ref } from "vue";
import type ToastsManager from "@/libs/ToastsManager";
import type { AxiosInstance } from "axios";

export default {
  components: { ClientHeaderVue, ClientFooterVue },
  setup() {
    const axios = inject<AxiosInstance>("axios");
    let user = ref<User | null>(null);
    const toastManager = inject<Ref<ToastsManager>>("toastManager");
    const isLoading = ref(false);

    onMounted(async () => {
      let restUserSession = new RestUserSession(axios!);
      user.value = (await restUserSession.getInfo()).value!.user;
      console.log(user.value);
    });

    const save = async () => {
      try {
        isLoading.value = true;
        let restUserSession = new RestUserSession(axios!);
        let response = await restUserSession.updateUserInfo(user.value!);
        console.log(response);
        if (!response.error) {
          toastManager?.value.alertSuccess("User info changed successfuly.");
        }
      } catch (e: any) {
        console.log(e);
        toastManager?.value.alertError(e.message);
      } finally {
        isLoading.value = false;
      }
    };
    return {
      user,
      save,
      isLoading,
    };
  },
};
