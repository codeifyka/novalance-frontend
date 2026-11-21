<template>
  <div class="relative" ref="bellRef">
    <!-- Bell Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      class="relative p-1 text-black hover:text-primary cursor-pointer flex items-center justify-center transition-colors focus:outline-none"
      title="Notifications"
    >
      <Icon icon="iconamoon:notification-fill" width="22" height="22" />
      
      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center shadow-sm pointer-events-none animate-pulse"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      v-motion-pop-visible
      class="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      <!-- Dropdown Header -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/70">
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-gray-800">Notifications</span>
          <span
            v-if="unreadCount > 0"
            class="text-[11px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full"
          >
            {{ unreadCount }} new
          </span>
        </div>

        <button
          v-if="unreadCount > 0"
          type="button"
          @click="markAllAsRead"
          class="text-xs font-medium text-primary hover:underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <!-- Notifications List -->
      <div class="max-h-80 overflow-y-auto divide-y divide-gray-50">
        <div v-if="isLoading" class="p-6 text-center text-xs text-gray-400">
          Loading notifications...
        </div>

        <div v-else-if="notifications.length === 0" class="p-8 text-center flex flex-col items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Icon icon="iconamoon:notification-fill" class="w-5 h-5 opacity-40" />
          </div>
          <span class="text-xs text-gray-400">No notifications yet</span>
        </div>

        <div
          v-for="notification in notifications"
          :key="notification.id"
          @click="handleNotificationClick(notification)"
          :class="[
            'px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors',
            notification.read_at ? 'hover:bg-gray-50 bg-white' : 'bg-purple-50/60 hover:bg-purple-100/60'
          ]"
        >
          <!-- Sender Avatar / Icon -->
          <div class="flex-shrink-0 mt-0.5">
            <img
              v-if="notification.data?.sender_avatar"
              :src="notification.data.sender_avatar"
              class="w-8 h-8 rounded-full object-cover border border-purple-200"
              alt="avatar"
            />
            <div
              v-else
              class="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs uppercase"
            >
              {{ notification.data?.sender_name ? notification.data.sender_name[0] : 'N' }}
            </div>
          </div>

          <!-- Notification Content -->
          <div class="flex-grow min-w-0">
            <div class="flex items-center justify-between gap-1">
              <span class="text-xs font-bold text-gray-900 truncate">
                {{ notification.data?.title || 'Notification' }}
              </span>
              <span class="text-[10px] text-gray-400 flex-shrink-0">
                {{ formatTime(notification.created_at) }}
              </span>
            </div>

            <p class="text-xs text-gray-600 line-clamp-2 mt-0.5 leading-snug">
              {{ notification.data?.message }}
            </p>

            <span
              v-if="notification.data?.price"
              class="inline-block mt-1 text-[11px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded"
            >
              ${{ notification.data.price }}
            </span>
          </div>

          <!-- Unread Dot Indicator -->
          <div v-if="!notification.read_at" class="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, computed, onMounted, onUnmounted, type Ref } from 'vue';
import { useRouter } from 'vue-router';
import type { AxiosInstance } from 'axios';
import moment from 'moment';
import RestNotifications from '@/libs/RestNotifications';

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  fetchNotifications: () => Promise<void>;
}

const router = useRouter();
const axios = inject<AxiosInstance>('axios');
const notificationsState = inject<Ref<NotificationsState>>('notificationsState');

const isOpen = ref(false);
const isLoading = ref(false);
const bellRef = ref<HTMLElement | null>(null);

const notifications = computed(() => notificationsState?.value?.notifications || []);
const unreadCount = computed(() => notificationsState?.value?.unreadCount || 0);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (bellRef.value && !bellRef.value.contains(event.target as Node)) {
    closeDropdown();
  }
};

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

const formatTime = (time: string) => {
  if (!time) return '';
  return moment(time).fromNow();
};

const markAllAsRead = async () => {
  if (!axios) return;
  const rest = new RestNotifications(axios);
  const res = await rest.markAllAsRead();
  if (res.isSuccess() && notificationsState?.value) {
    notificationsState.value.notifications.forEach(n => {
      n.read_at = new Date().toISOString();
    });
    notificationsState.value.unreadCount = 0;
  }
};

const handleNotificationClick = async (notification: AppNotification) => {
  // Mark as read if not already read
  if (!notification.read_at && axios) {
    const rest = new RestNotifications(axios);
    await rest.markAsRead(notification.id);
    notification.read_at = new Date().toISOString();
    if (notificationsState?.value && notificationsState.value.unreadCount > 0) {
      notificationsState.value.unreadCount -= 1;
    }
  }

  closeDropdown();

  // Route to link if present
  if (notification.data?.link) {
    router.push(notification.data.link);
  }
};
</script>
