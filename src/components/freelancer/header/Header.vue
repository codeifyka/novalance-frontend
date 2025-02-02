<template>
    <div class="w-full flex items-center justify-between">
        <a href="/home" class="text-black text-2xl font-bold">NovaLance</a>
        <div class="flex items-center gap-16">
            <a href="/chat_client_freelancer" class="text-black text-base flex items-center gap-2">
                <Icon icon="teenyicons:chat-outline" class="h-4 w-4 object-contain" />
                <div class="ml-1">Messages</div>
            </a>
            <a href="/services" class="text-black text-base flex items-center gap-2">
                <Icon icon="icons8:services" class="h-4 w-4 object-contain" />
                <div>My Services</div>
            </a>
            <a href="/portfolio" class="text-black text-base flex items-center gap-2">
                <Icon icon="bytesize:portfolio" class="h-4 w-4 object-contain" />
                <div class="ml-1">My Projects</div>
            </a>
            <div class="flex items-center gap-2">
                <Icon icon="material-symbols:notifications" class="h-4 w-4 object-contain" />
                <div class="w-5 h-5 rounded-full bg-gray-900"></div>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        target: String,
    },
    setup(props) {
        return { target: props.target };
    }
});
</script>
