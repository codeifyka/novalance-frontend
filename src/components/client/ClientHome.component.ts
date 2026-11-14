import backgroundImage from "@/assets/bg_client.png";
import logo from "@/assets/images/logo.png";
import RestUserSession from "@/libs/RestUserSession";
import { ref, inject, type Ref, onMounted } from "vue";
import { ClientHeaderVue } from "./header";
import { ClientFooterVue } from "./footer";
import { ServiceVue } from "../service";
import { PaginationVue } from "../pagination";
import type ToastsManager from "@/libs/ToastsManager";
import type { AxiosInstance } from "axios";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import RestCategories from "@/libs/RestCategories";

export default {
  components: { ClientHeaderVue, ServiceVue, PaginationVue, ClientFooterVue },
  setup() {
    let isShow = ref(false);
    let isShow2 = ref(false);
    let title = ref("");
    const showSortMenu = ref(false);
    const currentSort = ref<"Newest" | "Oldest" | "Best Price">("Newest");
    const sortOptions: ("Newest" | "Oldest" | "Best Price")[] = [
      "Newest",
      "Oldest",
      "Best Price",
    ];

    const currentPage = ref(1);
    const lastPage = ref(1);
    const perPage = ref(6);
    const totalServices = ref(0);

    const isLoading = ref(false);
    const isLoadingCategories = ref(true);
    const isLoadingServices = ref(true);

    const axios = inject<AxiosInstance>("axios");
    const restUserSession = new RestUserSession(axios!);
    const restFreelancerServices = new RestFreelancerServices(axios!);
    const restCategories = new RestCategories(axios!);

    const categories = ref<Category[]>([]);
    const selectedCategory = ref<Category | null>(null);
    const services = ref<Service[]>([]);

    let toastManager = inject<Ref<ToastsManager>>("toastManager");
    const handleErrorMessage = (error: string) => {
      toastManager?.value.alertError(error);
    };

    const toggleSortMenu = () => {
      showSortMenu.value = !showSortMenu.value;
    };

    const getCategoryCount = (category: Category) => {
      return category.services_count ?? 0;
    };

    const fetchServices = async () => {
      isLoadingServices.value = true;
      try {
        let sortParam = "newest";
        if (currentSort.value === "Oldest") sortParam = "oldest";
        if (currentSort.value === "Best Price") sortParam = "best_price";

        const response = await restFreelancerServices.getPaginated({
          page: currentPage.value,
          per_page: perPage.value,
          search: title.value.trim() || undefined,
          category_id: selectedCategory.value?.id,
          sort: sortParam,
        });

        if (response.isSuccess() && response.value) {
          services.value = response.value.items || [];
          currentPage.value = response.value.current_page || 1;
          lastPage.value = response.value.last_page || 1;
          totalServices.value = response.value.total || 0;
        } else {
          services.value = [];
          totalServices.value = 0;
          lastPage.value = 1;
        }
      } catch (err) {
        console.error("Failed to load services:", err);
        services.value = [];
        totalServices.value = 0;
      } finally {
        isLoadingServices.value = false;
      }
    };

    let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
    const onSearchInput = () => {
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(() => {
        currentPage.value = 1;
        fetchServices();
      }, 350);
    };

    const onSearchSubmit = (e?: Event) => {
      if (e) e.preventDefault();
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      currentPage.value = 1;
      fetchServices();
    };

    const selectCategory = (category: Category) => {
      if (selectedCategory.value?.id === category.id) {
        selectedCategory.value = null;
      } else {
        selectedCategory.value = category;
      }
      currentPage.value = 1;
      fetchServices();
    };

    const clearCategoryFilter = () => {
      selectedCategory.value = null;
      currentPage.value = 1;
      fetchServices();
    };

    const applySort = (sortOption: "Newest" | "Oldest" | "Best Price") => {
      currentSort.value = sortOption;
      showSortMenu.value = false;
      currentPage.value = 1;
      fetchServices();
    };

    const goToPage = (page: number) => {
      currentPage.value = page;
      fetchServices();
    };

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

      await fetchServices();
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

    return {
      backgroundImagePath: backgroundImage,
      logo,
      isShow,
      isShow2,
      title,
      logout,
      services,
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
      applySort,
      currentPage,
      lastPage,
      perPage,
      totalServices,
      onSearchInput,
      onSearchSubmit,
      goToPage,
    };
  },
};
