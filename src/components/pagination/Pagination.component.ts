import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Pagination",
  props: {
    currentPage: {
      type: Number,
      required: true,
      default: 1,
    },
    lastPage: {
      type: Number,
      required: true,
      default: 1,
    },
    total: {
      type: Number,
      default: 0,
    },
    perPage: {
      type: Number,
      default: 6,
    },
    itemLabel: {
      type: String,
      default: "services",
    },
  },
  emits: ["change-page"],
  setup(props, { emit }) {
    const goToPage = (page: number | string) => {
      if (typeof page !== "number") return;
      if (page >= 1 && page <= props.lastPage && page !== props.currentPage) {
        emit("change-page", page);
      }
    };

    const prevPage = () => {
      if (props.currentPage > 1) {
        emit("change-page", props.currentPage - 1);
      }
    };

    const nextPage = () => {
      if (props.currentPage < props.lastPage) {
        emit("change-page", props.currentPage + 1);
      }
    };

    const paginationPages = computed(() => {
      const current = props.currentPage;
      const total = props.lastPage;
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const pages: (number | string)[] = [];
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", total);
      } else if (current >= total - 3) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
      return pages;
    });

    const showingFrom = computed(() => {
      if (!props.total || props.total === 0) return 0;
      return (props.currentPage - 1) * props.perPage + 1;
    });

    const showingTo = computed(() => {
      if (!props.total) return 0;
      return Math.min(props.currentPage * props.perPage, props.total);
    });

    return {
      goToPage,
      prevPage,
      nextPage,
      paginationPages,
      showingFrom,
      showingTo,
    };
  },
});
