import { defineComponent, inject, ref, watch, type Ref } from "vue";
import axios, { type AxiosInstance } from "axios";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import UserSessionRepository from "@/libs/UserSessionRepository";
import type ToastsManager from "@/libs/ToastsManager";

export default defineComponent({
  props: {
    service: {
      type: Object as () => Service,
    },
  },
  setup(props) {
    const service = props.service;
    const injectedAxios = inject<AxiosInstance>("axios", axios);
    const toastManager = inject<Ref<ToastsManager>>("toastManager");
    const restServices = new RestFreelancerServices(injectedAxios);
    const userSessionRepository = new UserSessionRepository(localStorage);

    const hoveredRate = ref(0);
    const currentRate = ref<number>(props.service?.rate || 0);
    const ratingsCount = ref<number>(props.service?.ratings_count ?? 0);
    const isRating = ref(false);

    watch(
      () => props.service?.rate,
      (newRate) => {
        if (typeof newRate === "number") {
          currentRate.value = newRate;
        }
      }
    );

    watch(
      () => props.service?.ratings_count,
      (newCount) => {
        if (typeof newCount === "number") {
          ratingsCount.value = newCount;
        }
      }
    );

    const setHoveredRate = (rate: number) => {
      hoveredRate.value = rate;
    };

    const resetHoveredRate = () => {
      hoveredRate.value = 0;
    };

    const rateService = async (rate: number) => {
      if (!service?.id || isRating.value) return;

      const accountType = userSessionRepository.getAccountType();
      if (accountType !== "client") {
        return;
      }

      try {
        isRating.value = true;
        const res = await restServices.rateService(service.id, rate);
        if (res.isSuccess() && res.value) {
          currentRate.value = res.value.rate;
          ratingsCount.value = res.value.ratings_count;
          service.rate = res.value.rate;
          service.ratings_count = res.value.ratings_count;
          toastManager?.value?.alertSuccess("Service rated successfully!");
        } else {
          toastManager?.value?.alertError(
            res.error || "You can only rate a service after having a delivered or completed purchase."
          );
        }
      } catch (err: any) {
        toastManager?.value?.alertError(err?.message || "Failed to rate service.");
      } finally {
        isRating.value = false;
      }
    };

    return {
      service,
      hoveredRate,
      currentRate,
      ratingsCount,
      setHoveredRate,
      resetHoveredRate,
      rateService,
    };
  },
});
