import backgroundImage from "@/assets/bg_client.png";
import logo from "@/assets/images/logo.png";
import RestUserSession from "@/libs/RestUserSession";
import { ref, inject, computed, type Ref, onMounted } from "vue";
import { ClientHeaderVue } from "./header";
import { ServiceVue } from "../childcomponent/service";
import type ToastsManager from "@/libs/ToastsManager";
import type { AxiosInstance } from "axios";
import RestFreelancerServices from "@/libs/RestFreelancerServices";

export default {
  components: { ClientHeaderVue, ServiceVue },
  setup() {
    let isShow = ref(false);
    let isShow2 = ref(false);
    let title = ref("");
    const showSortMenu = ref(false);
    const currentSort = ref("Newest");
    const sortOptions = ["Newest", "Oldest", "Best Price"];
    const path = computed(() => ({
      path: "/all_services",
      query: { title: title.value },
    }));
    const isLoading = ref(false);
    const axios = inject<AxiosInstance>("axios");
    const restUserSession = new RestUserSession(axios!);
    const restFreelancerServices = new RestFreelancerServices(axios!);
    const handleErrorMessage = (error: string) => {
      toastManager?.value.alertError(error);
    };
    const toggleSortMenu = () => {
      showSortMenu.value = !showSortMenu.value;
    };
    let toastManager = inject<Ref<ToastsManager>>("toastManager");
    const services = ref<Service[]>([]);
    onMounted(async () => {
      let response = await restFreelancerServices.getAll2();
      if (response.isSuccess()) {
        services.value = response.value! || [];
      }
    });

    const logout = () => {
      isLoading.value = true;
      restUserSession
        .logout()
        .then((_) => {
          isLoading.value = false;
          location.href = "/home";
        })
        .catch((error) => {
          isLoading.value = false;
          console.log(error);
          handleErrorMessage("Bad credentials");
        });
    };

    const applySort = (sortOption: "Newest"| "Oldest"| "Best Price") => {
      currentSort.value = sortOption;
      showSortMenu.value = false;
    };
    return {
      backgroundImagePath: backgroundImage,
      logo,
      isShow,
      isShow2,
      path,
      title,
      logout,
      services,
      currentSort,
      sortOptions,
      toggleSortMenu,
      showSortMenu,
      applySort
    };
  },
};
