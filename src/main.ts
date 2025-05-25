import axios from 'axios';
import { createApp } from 'vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { MotionPlugin } from '@vueuse/motion'

import './style.css';
import App from './App.vue';

import { HomeVue } from './screens/home';
import { SignInVue } from './screens/sign_in';
import { SignUpVue } from './screens/sign_up';
import { JobPreviewVue } from './screens/job';
import { ServicePreviewVue } from './screens/service';
import { ProjectPreviewVue } from './screens/project';
import { ChatVue } from './screens/chat';
import { ChatPreviewVue } from './screens/chat/preview';

import setupAxios from './libs/ProtectAPI.ts';
import UserSessionRepository from './libs/UserSessionRepository';
import RestUserSession from './libs/RestUserSession';

import { Icon } from '@iconify/vue';
import { FreeLancerPortfolioVue } from './components/freelancer/portfolio';
import { FreeLancerServicesVue } from './components/freelancer/services';
import { FreeLancerCreateServiceVue } from './components/freelancer/services/create';
import { LoadingVue } from './components/loading';
import { ToastVue } from './components/toast';
import { ClientCreateJobVue } from './components/client/jobs/create'
import { FreeLancerCreateProjectVue } from './components/freelancer/portfolio/create';
import { ProfileVue } from './components/client/profile'
import { ClientServicesVue } from './components/client/services'
import { ServiceVue } from './components/service';
import { ClientMyjobsVue } from './components/client/jobs/my_jobs';
import { FreeLancerProfileVue } from './components/freelancer/profile';
import { ClientUpdateJobVue } from './components/client/jobs/update';
import { LandingPageVue } from './screens/landing_page';
import { ProposalsVue } from './screens/proposal';
<<<<<<< HEAD
import { ClientMyPurchasesVue } from './components/client/my_purchases';
=======
import { FreelancerSubmitProposalVue } from './components/freelancer/proposal/submit';
import { LoadingSpinnerVue } from './components/loading_spinner';
<<<<<<< HEAD
>>>>>>> 82fcbcf (Add Submit Proposal Page)
=======
import { RootSuspenseVue } from "./components/root_suspense";
>>>>>>> f80dfb5 (Fix some issues)

const app = createApp(RootSuspenseVue);

const routes: RouteRecordRaw[] = [
    // shared routes
    { path: '/', component: LandingPageVue },
    { path: '/home', component: HomeVue },
    { path: '/sign_in', component: SignInVue },
    { path: '/sign_up', component: SignUpVue },
    { path: '/job/:id', component: JobPreviewVue },
    { path: '/job/:id/submit_proposal', component: FreelancerSubmitProposalVue, },
    { path: '/service/:id', component: ServicePreviewVue },
    { path: '/project/:id', component: ProjectPreviewVue },
    { path: '/chat', component: ChatVue },
    { path: '/chat/:id', component: ChatPreviewVue },
    { path: '/services', component: FreeLancerServicesVue },
    { path: '/create_service', component: FreeLancerCreateServiceVue },
    { path: '/services/:username', component: FreeLancerServicesVue },
    { path: '/portfolio', component: FreeLancerPortfolioVue },
    { path: '/create_project', component: FreeLancerCreateProjectVue },
    { path: '/portfolio/:username', component: FreeLancerPortfolioVue },
    { path: '/create_job', component: ClientCreateJobVue },
    { path: '/client/profile', component: ProfileVue },
    { path: '/all_services', component: ClientServicesVue },
    { path: '/my_jobs', component: ClientMyjobsVue },
    { path: '/profile', component: FreeLancerProfileVue },
    { path: '/update_job/:id', component: ClientUpdateJobVue },
    { path: '/chat_client_freelancer/', component: ChatVue },
    { path: '/proposals/', component: ProposalsVue },
    { path: '/create_portfolio/', component: FreeLancerCreateProjectVue },
    { path: '/my_purchases/', component: ClientMyPurchasesVue },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Load User Session
let userSessionRepository = new UserSessionRepository(localStorage);
let restUserSession = new RestUserSession(axios!);
let access_token = userSessionRepository.getAccessToken();

if (access_token) {
    try {
        let response = await restUserSession.checkAuth(access_token);
        if (response.isFailure()) {
            userSessionRepository.clear();
        } else {
            app.provide('axios', setupAxios(access_token));
        }
    } catch (error) {
        console.log(error);
    }
}



const UNPROTECTED_ROUTES = ['/', '/sign_in', '/sign_up'];

router.beforeEach(async (to) => {
    if (!UNPROTECTED_ROUTES.includes(to.path)) {
        if (!access_token) {
            return { path: '/sign_in' };
        }
    }
});

app.component("Icon", Icon);
app.component("Loading", LoadingVue);
app.component("LoadingSpinner", LoadingSpinnerVue);
app.component("Toast", ToastVue);
app.component("Service", ServiceVue);

// WebSocket
const protocol = import.meta.env.MODE == "development" ? "ws" : "wss"; // Use 'wss' in production for secure WebSocket
const ws_host = import.meta.env.MODE == "development" ? "127.0.0.1:8001" : window.location.host;
const ws = new WebSocket(`${protocol}://${ws_host}/ws`);


ws.onopen = () => { console.log("WebSocket connection is open."); }

app.provide("ws", ws);

app.use(router);
app.use(MotionPlugin);
app.mount('#app');