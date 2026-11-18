<template>
    <div class="w-full flex flex-col gap-3 select-none">
        <!-- Main Image Container -->
        <div class="relative w-full aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm group">
            <div
                ref="container"
                class="w-full h-full flex overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth"
                @scroll="handleScroll"
            >
                <div
                    v-for="(img, index) in displayImages"
                    :key="index"
                    class="min-w-full h-full snap-center shrink-0 flex items-center justify-center bg-gray-100"
                >
                    <img
                        :src="getImageUrl(img)"
                        class="w-full h-full object-cover block"
                        :alt="'Service image ' + (index + 1)"
                    />
                </div>
            </div>

            <!-- Hover Arrows on Image -->
            <button
                v-if="displayImages.length > 1"
                @click.stop="prev"
                type="button"
                title="Previous image"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-0"
                :disabled="currentIndex === 0"
            >
                <Icon icon="mingcute:left-fill" class="text-xl text-white" />
            </button>
            <button
                v-if="displayImages.length > 1"
                @click.stop="next"
                type="button"
                title="Next image"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all cursor-pointer opacity-0 group-hover:opacity-100 disabled:opacity-0"
                :disabled="currentIndex === displayImages.length - 1"
            >
                <Icon icon="mingcute:right-fill" class="text-xl text-white" />
            </button>
        </div>

        <!-- Controls Row: Clickable Slide Dots & Navigation Arrows -->
        <div v-if="displayImages.length > 1" class="w-full flex items-center justify-between px-1">
            <!-- Clickable Indicator Dots -->
            <div class="flex items-center gap-2">
                <button
                    v-for="(_, index) in displayImages"
                    :key="index"
                    @click="goToSlide(index)"
                    type="button"
                    :title="'Go to image ' + (index + 1)"
                    class="rounded-full transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40"
                    :class="index === currentIndex ? 'bg-primary w-7 h-2.5 shadow-sm' : 'bg-gray-300 hover:bg-primary/50 w-2.5 h-2.5'"
                ></button>
            </div>

            <!-- Bottom Next & Prev Buttons -->
            <div class="flex items-center gap-2">
                <button
                    @click="prev"
                    type="button"
                    class="w-8 h-8 rounded-full bg-primary hover:bg-opacity-90 text-white flex items-center justify-center transition cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="currentIndex === 0"
                    title="Previous image"
                >
                    <Icon icon="mingcute:left-fill" class="text-xl text-white" />
                </button>
                <span class="text-xs font-semibold text-gray-500 min-w-[36px] text-center">
                    {{ currentIndex + 1 }} / {{ displayImages.length }}
                </span>
                <button
                    @click="next"
                    type="button"
                    class="w-8 h-8 rounded-full bg-primary hover:bg-opacity-90 text-white flex items-center justify-center transition cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="currentIndex === displayImages.length - 1"
                    title="Next image"
                >
                    <Icon icon="mingcute:right-fill" class="text-xl text-white" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

const props = defineProps<{
    images: Array<{ id?: number; url?: string; path?: string }>;
}>();

const container = ref<HTMLDivElement | null>(null);
const currentIndex = ref(0);

const displayImages = computed(() => {
    if (!props.images || props.images.length === 0) {
        return [{ url: '/default_service_thumbnail.jpg' }];
    }
    return props.images;
});

const getImageUrl = (img: { url?: string; path?: string }): string => {
    if (img.url) return img.url;
    if (img.path) {
        if (img.path.startsWith('http://') || img.path.startsWith('https://')) return img.path;
        if (img.path.startsWith('/')) return img.path;
        return `/${img.path}`;
    }
    return '/default_service_thumbnail.jpg';
};

const goToSlide = (index: number) => {
    if (index < 0 || index >= displayImages.value.length) return;
    currentIndex.value = index;
    if (container.value) {
        const itemWidth = container.value.clientWidth;
        container.value.scrollTo({
            left: index * itemWidth,
            behavior: 'smooth',
        });
    }
};

const next = () => {
    if (currentIndex.value < displayImages.value.length - 1) {
        goToSlide(currentIndex.value + 1);
    }
};

const prev = () => {
    if (currentIndex.value > 0) {
        goToSlide(currentIndex.value - 1);
    }
};

let scrollTimeout: any = null;
const handleScroll = () => {
    if (!container.value) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (!container.value) return;
        const scrollLeft = container.value.scrollLeft;
        const width = container.value.clientWidth;
        if (width > 0) {
            const index = Math.round(scrollLeft / width);
            if (index >= 0 && index < displayImages.value.length) {
                currentIndex.value = index;
            }
        }
    }, 50);
};
</script>