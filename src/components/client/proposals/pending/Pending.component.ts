import { ProposalVue } from '@/components/proposal';
import { ClientHeaderVue } from '@/components/client/header';
export default {
  components: { ClientHeaderVue, ProposalVue  },
  props: {proposals: Array},
  setup() {   

    return {

    };
  },
};
