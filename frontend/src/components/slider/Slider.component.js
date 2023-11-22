import { ref } from "vue"

export default {
    props: {
        images: Array,
    },
    setup(props){
        const selected = ref({ id: 1, url: '/default_service_thumbnail.jpg' });
        const container = ref(null);

        const calculateNewPos = (state) => {
            let currentPos = container.value.scrollLeft;
            let itemWidth = container.value.scrollWidth / props.images.length;
            let currentIndex = currentPos / itemWidth;
            return itemWidth * (currentIndex + (state == 'next' ? 1 : -1));
        }

        const next = () => {
            if(container.value){
                container.value.scrollTo({ behavior: 'smooth', left: calculateNewPos('next') });   
            }
        }

        const prev = () => {
            if(container.value){
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
}
