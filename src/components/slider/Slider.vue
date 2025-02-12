<template>
    <div class="w-full flex flex-col gap-3">
        <div ref="container" class="w-full aspect-video flex overflow-hidden rounded-lg">
            <div class="min-w-full h-full" v-for="img in images">
                <img :src="img?.url" class="block w-full h-full object-cover" alt="...">
            </div>
        </div>
        <div class="w-full flex items-center justify-between">
            <div class="flex">
                <button type="button"
                    :class="'rounded-full ' + (img.id == selected.id ? 'bg-primary w-6 h-3' : 'bg-gray-200 w-3 h-3')"
                    aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0" v-for="img in images"></button>
            </div>
            <div class="flex items-center gap-2">
                <button @click="prev" type="button"
                    class="flex items-center justify-center h-full cursor-pointer group focus:outline-none"
                    data-carousel-prev>
                    <span
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white group-hover:bg-violet-600/50  group-focus:ring-4 group-focus:ring-white group-focus:ring-purple-800/70 group-focus:outline-none">
                        <Icon icon="mingcute:left-fill" class="text-2xl text-purple-500" />
                        <span class="sr-only">Previous</span>
                    </span>
                </button>
                <button @click="next" type="button"
                    class="flex items-center justify-center h-full cursor-pointer group focus:outline-none"
                    data-carousel-next>
                    <span
                        class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white group-hover:bg-violet-600/50  group-focus:ring-4 group-focus:ring-white group-focus:ring-purple-800/70 group-focus:outline-none">
                        <Icon icon="mingcute:right-fill" class="text-2xl text-purple-500" />
                        <span class="sr-only">Next</span>
                    </span>
                </button>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
    props: {
        images: {
            type: Array as () => Image[],
            required: true,
        },
    },
    setup(props) {
        const selected = ref({ id: 1, url: '/default_service_thumbnail.jpg' });
        const container = ref<HTMLDivElement | null>(null);

        const calculateNewPos = (state: string) => {
            if (!container.value) {
                return;
            }

            let currentPos = container.value.scrollLeft;
            let itemWidth = container.value.scrollWidth / props.images.length;
            let currentIndex = currentPos / itemWidth;
            return itemWidth * (currentIndex + (state == 'next' ? 1 : -1));
        }

        const next = () => {
            if (container.value) {
                container.value.scrollTo({ behavior: 'smooth', left: calculateNewPos('next') });
            }
        }

        const prev = () => {
            if (container.value) {
                container.value.scrollTo({ behavior: 'smooth', left: calculateNewPos('prev') });
            }
        }

        return {
            container,
            images: props.images,
            selected,
            next,
            prev
        }
    }
});
</script>