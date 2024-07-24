import logo from '@/assets/images/logo.png';
import { inject, onMounted, ref, onBeforeUnmount } from 'vue';

export default {
    setup() {
        const { sectionRefHome, sectionRefServices, sectionRefAbout, sectionRefFaq } = inject('Sections');
        const navbarRef = ref(null);
        const scrollNavbar = ref(false);
        const showMobileMenu = ref(false);

        const handleScroll = (entries) => {
            entries.forEach(entry => {
                console.log(entry.isIntersecting)
                console.log(scrollNavbar.value)
                if (!entry.isIntersecting) {
                    scrollNavbar.value = true;
                } else {
                    scrollNavbar.value = false;
                }
            });
        };

        let observer;

        onMounted(() => {
            observer = new IntersectionObserver(handleScroll, {
                root: null,
                threshold: 0
            });

            if (navbarRef.value) {
                observer.observe(navbarRef.value);
            }
        });

        onBeforeUnmount(() => {
            if (observer && navbarRef.value) {
                observer.unobserve(navbarRef.value);
            }
        });

        function scrollTo(view) {
            if (view && view.scrollIntoView) {
                view.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.warn('Element not found or not scrollable:', view);
            }
        }

        function toggleMenu() {
            showMobileMenu.value = !showMobileMenu.value;
        }
        
        return {
            logo,
            scrollNavbar,
            navbarRef,
            sectionRefHome,
            sectionRefServices,
            sectionRefAbout,
            sectionRefFaq,
            scrollTo,
            showMobileMenu,
            toggleMenu
        };
    }
};
