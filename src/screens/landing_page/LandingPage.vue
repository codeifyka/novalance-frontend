<template>
    <div class="bg-violet-100 relative min-h-screen max-h-screen overflow-x-hidden">
        <HeaderVue />
        <MotionGroup preset="slideVisibleTop" :duration="600">
            <div id="home" class="flex w-full h-screen items-start gap-16 from-purple to-nice-purple bg-gradient-to-b rounded-bl-[5rem]">
                <div class="ml-24 w-1/2 hidden lg:flex">
                    <img src="@/assets/images/landing_page.jpg" alt="welcome_image"
                        class="h-[32rem] w-96 rounded-b-[5rem] object-cover">
                    <div
                        class="border border-purple text-purple rounded-br-lg rounded-tr-lg transition-all bg-white px-8 py-2 text-lg rounded-tl-lg absolute left-[25%] top-[23%] ">
                        Post an Offer</div>
                </div>
                <div class="flex flex-col w-full items-start justify-center h-full gap-4 px-4 lg:px-0">
                    <div class="text-3xl lg:text-5xl text-white font-semibold">Welcome</div>
                    <div class="text-lg lg:text-xl w-full lg:w-2/5 text-wrap text-gray-100">
                        to <span class="text-violet-300">Novalance</span> where talent meets opportunity. Let's build something great together!
                    </div>
                    <div class="flex flex-col w-full gap-2 lg:items-center lg:flex-row text-white">
                        <router-link to="/sign_up"
                            class="px-8 py-1 lg:py-2 text-center font-semibold rounded-lg border hover:bg-violet-400 transition-all duration-300 hover:border-none active:scale-105">Provide
                            A Service</router-link>
                        <router-link to="/sign_up"
                            class="px-8 py-1 lg:py-2 text-center font-semibold rounded-lg border border-violet-500 bg-violet-500 hover:bg-violet-300 transition-all duration-300 hover:border-none active:scale-105">Find
                            Freelancer</router-link>
                    </div>
                </div>
                <div class="bg-white lg:w-20 lg:h-20 w-16 h-16 absolute top-3/4 left-[90%] lg:left-[96%] rounded-full">
                </div>
            </div>
            <div ref="sectionRefServices" id="services" class="py-16">
                <div class="flex flex-col gap-4 items-center">
                    <div class="text-center text-2xl lg:w-96">Get done with ease with creative professionals
                    </div>
                    <div class="flex flex-col lg:flex-row justify-center gap-4">
                        <CardVue v-for="(item) in cardContents" :icon="item.icon" :title="item.title"
                            :paragraph="item.paragraph" />
                    </div>
                </div>
            </div>
            <div ref="sectionRefAbout" id="about"
                class="w-full relative overflow-hidden bg-white flex justify-between items-center flex-col lg:flex-row py-16 px-4 lg:px-24 gap-8 lg:gap-0">
                <div class="absolute bg-purple w-14 h-14  rounded-full bottom-[97%] lg:bottom-[95%] right-2"></div>
                <div class="w-full lg:w-1/2 flex flex-col gap-8">
                    <div class="flex flex-col ">
                        <div class="font-bold lg:text-3xl text-2xl flex flex-wrap gap-2">
                            Why you should choose <div class="text-purple"> Novalance</div>
                        </div>
                        <div class="text-lg">Novalance is an Freelance web application that aims to solve
                            the
                            problems of freelancers and entrepreneurs in a professional work environment.</div>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div v-for="(item, index) in whyContent" :key="index">
                            <div class="flex items-center gap-2">
                                <Icon :icon="item.icon" width="24" height="24" class="text-purple" />
                                <div class="font-semibold ">{{ item.title }}</div>
                            </div>
                            <div class="text-black/80 text-sm">{{ item.paragraph }}</div>
                        </div>
                    </div>
                </div>
                <div class="w-full lg:w-1/3">
                    <img src="@/assets/images/Why.png" alt="why">
                </div>
            </div>
            <div ref="sectionRefFaq" id="faq" class="bg-purple py-16 px-4 lg:px-24 flex flex-col gap-8 relative overflow-hidden">
                <div class="text-white text-center lg:text-start text-2xl font-semibold lg:text-3xl">Frequenty Asked
                    Questions
                </div>
                <div class="flex flex-col gap-4">
                    <QuestionAnswerVue v-for="(faq, index) in frequentlyQst" :key="index" :question="faq.question"
                        :answer="faq.answer" />
                </div>
                <div class="absolute bg-white w-2 h-2  rounded-full top-[94%]  right-12"></div>
                <div class="absolute bg-white w-4 h-4  rounded-full top-[97%]  right-16"></div>
                <div class="absolute bg-white w-14 h-14  rounded-full top-[97%] right-2"></div>

            </div>
            <div class="w-full lg:w-3/5 px-4 mx-auto my-32 flex flex-col gap-4 items-center">
                <div class="text-center font-bold text-xl lg:text-3xl capitalize">Come on join now</div>
                <div class="text-lg text-center">Novalance Platform guarantees you your financial right completely, so you don't
                    have to
                    worry, Rest assured when creating projects or providing services. Where the site is an intermediary
                    between
                    the independent and the project owner and guarantees the rights of both parties until the end of the
                    projects, and this is in the event of compliance with the terms of the site</div>
                <div class="flex flex-col w-full justify-center gap-2 lg:items-center lg:flex-row ">
                    <router-link to="/sign_up"
                        class="px-8 py-1 lg:py-2 text-center rounded-lg text-purple border-purple border hover:bg-purple hover:text-white transition-all duration-300">Provide
                        A Service</router-link>
                    <router-link to="/sign_up"
                        class="px-8 py-1 lg:py-2 text-center rounded-lg text-white border-purple border bg-purple hover:bg-purple/80  transition-all duration-300">Find
                        Freelancer</router-link>
                </div>
            </div>
        </MotionGroup>

        <FooterVue />
    </div>
</template>

<script lang="ts" setup>
import { CardVue } from "@/components/landing_page/card";
import { FooterVue } from "@/components/landing_page/footer";
import { HeaderVue } from "@/components/landing_page/header";
import { QuestionAnswerVue } from "@/components/landing_page/question_answer";
import { ref, provide, onMounted } from 'vue'

const sectionRefHome = ref<HTMLElement | null>(null);
const sectionRefServices = ref<HTMLElement | null>(null);
const sectionRefAbout = ref<HTMLElement | null>(null);
const sectionRefFaq = ref<HTMLElement | null>(null);

onMounted(() => {
    sectionRefHome.value = document.getElementById('home');
    sectionRefServices.value = document.getElementById('services');
    sectionRefAbout.value = document.getElementById('about');
    sectionRefFaq.value = document.getElementById('faq');
});

provide('Sections', {
    sectionRefHome,
    sectionRefServices,
    sectionRefAbout,
    sectionRefFaq
})

const cardContents = [
    {
        icon: 'teenyicons:search-property-solid',
        title: 'Search for the freelancer',
        paragraph: 'Start now finding the perfect freelancer to achieve your vision and develop your business successfully. '
    },
    {
        icon: 'fluent:gift-card-money-20-filled',
        title: 'Trusted Transactions',
        paragraph: 'Enjoy high-quality services from trusted professionals with a money-back guarantee in case of dissatisfaction. '
    },
    {
        icon: 'eos-icons:service',
        title: 'Offer your services',
        paragraph: 'If you are a professional in your field, this is your opportunity to showcase your services and reach clients who need your expertise.'
    },
];
const whyContent = [
    {
        icon: 'ic:baseline-verified',
        title: 'Fast and reliable transactions',
        paragraph: 'The site contains professional freelancers whose accounts are documented and verified before publishing their services to ensure safe and serious transactions.'
    },
    {
        icon: 'ri:exchange-fill',
        title: 'Refund',
        paragraph: 'The site contains professional freelancers whose accounts are documented and verified before publishing their services to ensure safe and serious transactions.'
    },
    {
        icon: 'ion:time',
        title: 'Technical support around the clock',
        paragraph: 'We are here to help you and respond to any problems you encounter at any time.'
    }
];
const frequentlyQst = [
    {
        question: 'Is it free to join the platform?',
        answer: 'Yes, joining our platform is completely free. You can sign up, create a profile, and browse available jobs or freelancers without any cost.'
    },
    {
        question: 'How to find a freelancer?',
        answer: 'To find a freelancer, simply use our search feature to filter by skills, experience, and ratings. You can also post a job listing and receive proposals from interested freelancers.'
    },
    {
        question: 'How does payment work?',
        answer: 'Payments are made through our secure payment system. Once you have agreed on the terms with a freelancer, you can fund the project. The payment will be held in escrow and released to the freelancer once you are satisfied with the work.'
    },
    {
        question: 'What payment methods are available?',
        answer: 'We support various payment methods including credit cards with chargily api like Cart El Dhahabiya and Ecib . You can choose the most convenient method for you when making a payment.'
    },
    {
        question: 'I`m a freelancer, how are they looking for me?',
        answer: 'Clients can find you by searching for freelancers based on skills, experience, and ratings. You can also increase your visibility by completing your profile and share projects and services, showcasing your portfolio, and actively applying for jobs that match your expertise.'
    },
];
</script>