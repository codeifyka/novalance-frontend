import backgroundImage from "@/assets/bg_client.png";
import logo from "@/assets/images/logo.png";
import RestUserSession from "@/libs/RestUserSession";
import { ref, inject, computed, type Ref, onMounted } from "vue";
import { ClientHeaderVue } from "./header";
import { ServiceVue } from "../service";
import type ToastsManager from "@/libs/ToastsManager";
import type { AxiosInstance } from "axios";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import RestCategories from "@/libs/RestCategories";

export default {
  components: { ClientHeaderVue, ServiceVue },
  setup() {
    let isShow = ref(false);
    let isShow2 = ref(false);
    let title = ref("");
    const showSortMenu = ref(false);
    const currentSort = ref<"Newest" | "Oldest" | "Best Price">("Newest");
    const sortOptions: ("Newest" | "Oldest" | "Best Price")[] = ["Newest", "Oldest", "Best Price"];
    const path = computed(() => ({
      path: "/all_services",
      query: { title: title.value },
    }));
    const isLoading = ref(false);
    const isLoadingCategories = ref(true);
    const isLoadingServices = ref(true);
    const axios = inject<AxiosInstance>("axios");
    const restUserSession = new RestUserSession(axios!);
    const restFreelancerServices = new RestFreelancerServices(axios!);
    const restCategories = new RestCategories(axios!);

    const categories = ref<Category[]>([]);
    const selectedCategory = ref<Category | null>(null);

    const handleErrorMessage = (error: string) => {
      toastManager?.value.alertError(error);
    };
    const toggleSortMenu = () => {
      showSortMenu.value = !showSortMenu.value;
    };
    let toastManager = inject<Ref<ToastsManager>>("toastManager");
    const services = ref<Service[]>([]);

    const getCategoryCount = (category: Category) => {
      if (category.services_count !== undefined) {
        return category.services_count;
      }
      if (!services.value) return 0;
      return services.value.filter(
        (s) => s.category_id === category.id || s.category?.id === category.id
      ).length;
    };

    const selectCategory = (category: Category) => {
      if (selectedCategory.value?.id === category.id) {
        selectedCategory.value = null;
      } else {
        selectedCategory.value = category;
      }
    };

    const clearCategoryFilter = () => {
      selectedCategory.value = null;
    };

    const displayedServices = computed(() => {
      let list = services.value || [];

      if (selectedCategory.value) {
        list = list.filter(
          (s) =>
            s.category_id === selectedCategory.value?.id ||
            s.category?.id === selectedCategory.value?.id
        );
      }

      if (title.value && title.value.trim() !== "") {
        const q = title.value.toLowerCase().trim();
        list = list.filter(
          (s) =>
            (s.title && s.title.toLowerCase().includes(q)) ||
            (s.description && s.description.toLowerCase().includes(q))
        );
      }

      if (currentSort.value === "Newest") {
        return [...list].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else if (currentSort.value === "Oldest") {
        return [...list].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      } else if (currentSort.value === "Best Price") {
        return [...list].sort(
          (a, b) => Number(a.price?.value || 0) - Number(b.price?.value || 0)
        );
      }

      return list;
    });

    onMounted(async () => {
      try {
        const categoriesRes = await restCategories.getAll();
        if (categoriesRes.isSuccess()) {
          categories.value = categoriesRes.value! || [];
        }
      } catch (e) {
        console.error(e);
      } finally {
        isLoadingCategories.value = false;
      }

      try {
        const servicesRes = await restFreelancerServices.getAll2();
        if (servicesRes.isSuccess()) {
          services.value = servicesRes.value! || [];
        }
      } catch (e) {
        console.error(e);
      } finally {
        isLoadingServices.value = false;
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

    const applySort = (sortOption: "Newest" | "Oldest" | "Best Price") => {
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
      displayedServices,
      categories,
      selectedCategory,
      selectCategory,
      clearCategoryFilter,
      getCategoryCount,
      isLoadingCategories,
      isLoadingServices,
      currentSort,
      sortOptions,
      toggleSortMenu,
      showSortMenu,
      applySort
    };
  },
};
