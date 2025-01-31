import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    service: {
      type: Object as () => Service,
    },
  },
  setup(props) {
    const service = props.service;
    const hoveredRate = ref(0);
    const setHoveredRate = (rate: number) => {
      hoveredRate.value = rate;
    };
    const resetHoveredRate = () => {
      hoveredRate.value = 0;
    };
    return { service, hoveredRate, setHoveredRate, resetHoveredRate };
  },
});
