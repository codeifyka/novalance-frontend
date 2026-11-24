<template>
<nav :class="['w-full', 'h-16', 'md:h-20', 'shadow-sm', 'flex', 'px-8', 'md:px-24', 'justify-between', 'items-center', 'fixed', 'top-0', 'z-50', 'bg-white']">
  <router-link to="/home" class="h-full flex items-center cursor-pointer">
    <img src="/logo.png" class="mr-2 h-8 object-contain rounded-full" alt="NovaLance logo" />
    <span class="text-black text-xl font-bold inline-block hover:text-primary">NovaLance</span>
  </router-link>

  <div class="flex items-center gap-8">
    <!-- Messages -->
    <router-link
      to="/chat_client_freelancer"
      :class="`hidden md:flex items-center gap-2 cursor-pointer transition-colors duration-200 ${target === 'messages' ? 'text-primary font-medium' : 'text-black hover:text-primary'}`"
    >
      <Icon icon="teenyicons:chat-outline" class="w-4 h-4 object-contain" />
      <span>Messages</span>
    </router-link>

    <!-- My Services -->
    <router-link
      to="/services"
      :class="`hidden md:flex items-center gap-2 cursor-pointer transition-colors duration-200 ${target === 'services' ? 'text-primary font-medium' : 'text-black hover:text-primary'}`"
    >
      <Icon icon="icons8:services" class="w-5 h-5 object-contain" />
      <span>My Services</span>
    </router-link>

    <!-- My Projects -->
    <router-link
      to="/portfolio"
      :class="`hidden md:flex items-center gap-2 cursor-pointer transition-colors duration-200 ${target === 'portfolio' ? 'text-primary font-medium' : 'text-black hover:text-primary'}`"
    >
      <Icon icon="bytesize:portfolio" class="w-4 h-4 object-contain" />
      <span>My Projects</span>
    </router-link>

    <!-- Saved Jobs -->
    <router-link
      to="/saved_jobs"
      :class="`hidden md:flex items-center gap-2 cursor-pointer transition-colors duration-200 ${target === 'saved_jobs' ? 'text-primary font-medium' : 'text-black hover:text-primary'}`"
    >
      <Icon icon="solar:bookmark-linear" class="w-5 h-5 object-contain" />
      <span>Saved Jobs</span>
    </router-link>

    <!-- Wallet -->
    <router-link
      to="/wallet"
      :class="`hidden md:flex items-center gap-2 cursor-pointer transition-colors duration-200 ${target === 'wallet' ? 'text-primary font-medium' : 'text-black hover:text-primary'}`"
    >
      <Icon icon="solar:wallet-money-bold" class="w-5 h-5 object-contain" />
      <span>Wallet</span>
    </router-link>

    <div class="flex items-center gap-4">
      <!-- Notification bell -->
      <NotificationBell />

      <!-- Profile Avatar -->
      <router-link
        to="/profile"
        class="w-8 h-8 rounded-full block cursor-pointer overflow-hidden border border-gray-200 hover:ring-2 hover:ring-primary transition-all"
        title="View Profile"
      >
        <img
          class="w-full h-full rounded-full object-cover"
          :src="userInfo?.user?.profile_picture || DEFAULT_PROFILE_PICTURE"
          alt="profile picture"
        />
      </router-link>

      <!-- Mobile menu toggle -->
      <button @click="toggleMenu" class="md:hidden p-2 hover:bg-violet-50 text-black rounded-full cursor-pointer">
        <Icon v-if="showMobileMenu" icon="material-symbols:close" width="24" height="24" />
        <Icon v-else icon="ri:menu-4-fill" width="24" height="24" />
      </button>
    </div>
  </div>
</nav>

<!-- Mobile Menu -->
<nav
  v-if="showMobileMenu"
  v-motion-pop-visible
  class="fixed top-0 right-0 inset-[1rem] bg-white shadow-xl rounded-2xl z-50 flex flex-col items-center justify-center space-y-6 md:hidden"
>
  <button @click="toggleMenu" class="p-2 text-black rounded-full absolute top-4 right-4 cursor-pointer hover:bg-gray-100">
    <Icon icon="material-symbols:close" width="28" height="28" />
  </button>
  <router-link to="/home" @click="showMobileMenu = false" class="text-black hover:text-primary font-bold text-xl flex items-center cursor-pointer mb-2">
    <img src="/logo.png" class="mr-2 h-8 object-contain rounded-full" alt="NovaLance logo" />
    <span>NovaLance</span>
  </router-link>
  <router-link to="/chat_client_freelancer" @click="showMobileMenu = false" class="text-black hover:text-primary flex items-center gap-3 w-40 text-base cursor-pointer py-1">
    <Icon icon="teenyicons:chat-outline" class="w-5 h-5" />
    <span>Messages</span>
  </router-link>
  <router-link to="/services" @click="showMobileMenu = false" class="text-black hover:text-primary flex items-center gap-3 w-40 text-base cursor-pointer py-1">
    <Icon icon="icons8:services" class="w-5 h-5" />
    <span>My Services</span>
  </router-link>
  <router-link to="/portfolio" @click="showMobileMenu = false" class="text-black hover:text-primary flex items-center gap-3 w-40 text-base cursor-pointer py-1">
    <Icon icon="bytesize:portfolio" class="w-5 h-5" />
    <span>My Projects</span>
  </router-link>
  <router-link to="/saved_jobs" @click="showMobileMenu = false" class="text-black hover:text-primary flex items-center gap-3 w-40 text-base cursor-pointer py-1">
    <Icon icon="solar:bookmark-linear" class="w-5 h-5" />
    <span>Saved Jobs</span>
  </router-link>
  <router-link to="/wallet" @click="showMobileMenu = false" class="text-black hover:text-primary flex items-center gap-3 w-40 text-base cursor-pointer py-1">
    <Icon icon="solar:wallet-money-bold" class="w-5 h-5" />
    <span>Wallet</span>
  </router-link>
  <router-link to="/profile" @click="showMobileMenu = false" class="text-black hover:text-primary flex items-center gap-3 w-40 text-base cursor-pointer py-1">
    <Icon icon="iconamoon:profile-circle-fill" class="w-5 h-5" />
    <span>My Profile</span>
  </router-link>
</nav>
</template>

<script lang="ts" setup>
import { NotificationBell } from '@/components/notifications';
import { DEFAULT_PROFILE_PICTURE } from '@/consts';
import { inject, ref } from 'vue';

const props = defineProps<{ target?: string }>();
const target = props.target;
const userInfo = inject<UserInfo | null>('user_info', null);

const showMobileMenu = ref(false);

function toggleMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}
</script>
