import { PurchaseCardVue } from "@/components/purchase_card";
import { FreeLancerHeaderVue } from "../header";
import RestFreelancerServices from "@/libs/RestFreelancerServices";
import { ref, computed, inject, onMounted } from "vue";
import type { AxiosInstance } from "axios";

export default {
    components: { PurchaseCardVue, FreeLancerHeaderVue },
    setup() {
        const axios = inject<AxiosInstance>('axios');
        const restServices = new RestFreelancerServices(axios!);
        const orders = ref<Purchase[]>([]);
        const isLoading = ref(true);
        const activeTab = ref<'all' | 'active' | 'delivered' | 'completed' | 'disputed'>('all');

        const fetchOrders = async () => {
            isLoading.value = true;
            try {
                const response = await restServices.getPurchases();
                if (response.isSuccess()) {
                    orders.value = response.value || [];
                }
            } catch (err) {
                console.error("Error fetching service orders:", err);
            } finally {
                isLoading.value = false;
            }
        };

        const filteredOrders = computed(() => {
            if (activeTab.value === 'all') return orders.value;
            return orders.value.filter(order => order.status === activeTab.value);
        });

        const tabCounts = computed(() => ({
            all: orders.value.length,
            active: orders.value.filter(o => o.status === 'active').length,
            delivered: orders.value.filter(o => o.status === 'delivered').length,
            completed: orders.value.filter(o => o.status === 'completed').length,
            disputed: orders.value.filter(o => o.status === 'disputed').length,
        }));

        onMounted(() => {
            fetchOrders();
        });

        return {
            orders,
            filteredOrders,
            tabCounts,
            activeTab,
            isLoading,
            fetchOrders,
        };
    }
};
