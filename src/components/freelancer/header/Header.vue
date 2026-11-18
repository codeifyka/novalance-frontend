<template>
<nav :class="['w-full', 'h-16', 'md:h-20', 'shadow-sm', 'flex', 'px-8', 'md:px-24', 'justify-between', 'items-center', 'fixed', 'top-0', 'z-50', 'bg-white']">
  <router-link to="/home" class="h-full flex justify-center items-center cursor-pointer">
    <img src="/logo.png" class="mr-2 h-8 object-contain rounded-full" alt="NovaLance logo" />
    <h1 class="text-black text-xl font-bold inline-block uppercase hover:text-primary">Novalance</h1>
  </router-link>

  <div class="flex items-center gap-8 justify-around">
    <!-- Messages -->
    <router-link to="/chat_client_freelancer/" class="text-black hidden lg:flex items-center gap-2 cursor-pointer group">
      <Icon icon="jam:messages-f" width="20" height="20" class="text-black group-hover:text-primary" />
      <span class="group-hover:text-primary">Messages</span>
    </router-link>

    <!-- Services -->
    <router-link
      to="/services"
      :class="`hidden lg:flex items-center gap-2 cursor-pointer group ${target === 'services' ? 'text-primary font-medium' : 'text-black'}`"
    >
      <Icon icon="icons8:services" width="20" height="20" class="group-hover:text-primary" />
      <span class="group-hover:text-primary">My Services</span>
    </router-link>

    <!-- Projects -->
    <router-link
      to="/portfolio"
      :class="`hidden lg:flex items-center gap-2 cursor-pointer group ${target === 'portfolio' ? 'text-primary font-medium' : 'text-black'}`"
    >
      <Icon icon="bytesize:portfolio" width="20" height="20" class="group-hover:text-primary" />
      <span class="group-hover:text-primary">My Projects</span>
    </router-link>

    <!-- Saved Jobs -->
    <router-link
      to="/saved_jobs"
      :class="`hidden lg:flex items-center gap-2 cursor-pointer group ${target === 'saved_jobs' ? 'text-primary font-medium' : 'text-black'}`"
    >
      <Icon icon="solar:bookmark-linear" width="20" height="20" class="group-hover:text-primary" />
      <span class="group-hover:text-primary">Saved Jobs</span>
    </router-link>

    <div class="flex items-center gap-2">
      <!-- Notification bell -->
      <Icon icon="iconamoon:notification-fill" width="20" height="20" class="cursor-pointer text-black hover:text-primary" />

      <!-- Avatar + profile dropdown -->
      <div
        @click="isShowProfile = !isShowProfile"
        class="rounded-full bg-black text-white text-sm w-8 h-8 hidden lg:flex justify-center items-center uppercase relative cursor-pointer"
      >
        <div
          v-if="isShowProfile"
          v-motion-pop-visible
          class="py-5 px-2 w-40 bg-white text-black shadow-md absolute top-12 right-0 transition-all duration-200 rounded-lg"
          @click.stop
        >
          <ul class="text-black">
            <router-link
              to="/profile"
              class="flex items-center mb-2 p-1 transition-colors duration-300 rounded-lg hover:bg-violet-100 hover:bg-opacity-75 cursor-pointer"
            >
              <Icon icon="iconamoon:profile-circle-fill" class="mr-2" />
              <span>My Profile</span>
            </router-link>
            <button
              @click="logout"
              class="w-full flex items-center mb-2 p-1 transition-colors duration-300 rounded-lg hover:bg-violet-100 hover:bg-opacity-75 cursor-pointer"
            >
              <Icon icon="clarity:logout-solid" class="mr-2" />
              <span>Logout</span>
            </button>
          </ul>
        </div>
        <img v-if="userInfo?.user?.profile_picture" :src="userInfo.user.profile_picture" class="w-full h-full rounded-full object-cover" />
        <span v-else>{{ userInfo?.user?.first_name ? userInfo.user.first_name[0] : 'U' }}</span>
      </div>

      <!-- Mobile menu toggle -->
      <button @click="toggleMenu" class="lg:hidden p-2 hover:bg-purple text-black rounded-full">
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
  class="fixed top-0 right-0 inset-[1rem] bg-white shadow-md rounded-bl-full z-50 flex flex-col items-center justify-center space-y-8"
>
  <button @click="toggleMenu" class="lg:hidden p-2 text-black rounded-full absolute top-4 right-4">
    <Icon icon="material-symbols:close" width="32" height="32" />
  </button>
  <router-link to="/home" class="text-black hover:text-primary font-bold uppercase mb-4 flex justify-center items-center cursor-pointer">
    <img src="/logo.png" class="mr-2 h-8 object-contain rounded-full" alt="NovaLance logo" />
    <span>Novalance</span>
  </router-link>
  <router-link to="/chat_client_freelancer/" class="text-black flex items-center gap-2 w-36 cursor-pointer">
    <Icon icon="jam:messages-f" width="20" height="20" />
    <span>Messages</span>
  </router-link>
  <router-link to="/services" class="text-black flex items-center gap-2 w-36 cursor-pointer">
    <Icon icon="icons8:services" width="20" height="20" />
    <span>My Services</span>
  </router-link>
  <router-link to="/portfolio" class="text-black flex items-center gap-2 w-36 cursor-pointer">
    <Icon icon="bytesize:portfolio" width="20" height="20" />
    <span>My Projects</span>
  </router-link>
  <router-link to="/saved_jobs" class="text-black flex items-center gap-2 w-36 cursor-pointer">
    <Icon icon="solar:bookmark-linear" width="20" height="20" />
    <span>Saved Jobs</span>
  </router-link>
  <div @click="isShowProfile = !isShowProfile" class="text-black flex w-36 relative cursor-pointer items-center gap-2">
    <Icon icon="iconamoon:profile-circle-fill" width="20" height="20" />
    <span>Profile</span>
    <Icon icon="ep:arrow-down-bold" width="14" height="14" class="ml-1 mt-0.5 transition-all duration-200" :class="[isShowProfile ? 'rotate-180' : '']" />
    <div
      v-motion-pop-visible
      class="py-5 px-2 w-40 bg-white text-black shadow-md absolute bottom-10 transition-all duration-200 rounded-lg"
      v-if="isShowProfile"
    >
      <ul class="text-black">
        <router-link
          to="/profile"
          class="flex items-center mb-2 p-1 transition-colors duration-300 rounded-lg hover:bg-violet-100 hover:bg-opacity-75 cursor-pointer"
        >
          <Icon icon="iconamoon:profile-circle-fill" class="mr-2" />
          <span>My Profile</span>
        </router-link>
        <button
          @click="logout"
          class="w-full flex items-center mb-2 p-1 transition-colors duration-300 rounded-lg hover:bg-violet-100 hover:bg-opacity-75 cursor-pointer"
        >
          <Icon icon="clarity:logout-solid" class="mr-2" />
          <span>Logout</span>
        </button>
      </ul>
    </div>
  </div>
</nav>
</template>

<script lang="ts" setup>
import RestUserSession from '@/libs/RestUserSession';
import { inject, ref } from 'vue';
import axios from 'axios';

const props = defineProps<{ target: string }>();
const target = props.target;
const userInfo = inject<UserInfo | null>('user_info', null);

const isShowProfile = ref(false);
const showMobileMenu = ref(false);

function toggleMenu() {
  showMobileMenu.value = !showMobileMenu.value;
}

const logout = () => {
  const restUserSession = new RestUserSession(axios);
  restUserSession.logout().then(() => {
    location.href = '/';
  }).catch(() => {
    location.href = '/';
  });
};
</script>
