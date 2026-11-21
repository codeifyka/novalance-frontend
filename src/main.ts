import { createApp } from 'vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { MotionPlugin } from '@vueuse/motion'

import './style.css';

// Shared components (used across pages) stay in the initial bundle.
import { Icon } from '@iconify/vue';
import { LoadingVue } from './components/loading';
import { ToastVue } from './components/toast';
import { ServiceVue } from './components/service';
import { LoadingSpinnerVue } from './components/loading_spinner';
import { RootSuspenseVue } from "./components/root_suspense";
import { PaginationVue } from './components/pagination';

const app = createApp(RootSuspenseVue);

const routes: RouteRecordRaw[] = [
    // shared routes
    { path: '/', component: () => import('./screens/landing_page').then(m => m.LandingPageVue) },
    { path: '/home', component: () => import('./screens/home').then(m => m.HomeVue) },
    { path: '/sign_in', component: () => import('./screens/sign_in').then(m => m.SignInVue) },
    { path: '/sign_up', component: () => import('./screens/sign_up').then(m => m.SignUpVue) },
    { path: '/job/:id', component: () => import('./screens/job').then(m => m.JobPreviewVue) },
    { path: '/job/:id/submit_proposal', component: () => import('./components/freelancer/proposal/submit').then(m => m.FreelancerSubmitProposalVue) },
    { path: '/service/:id', component: () => import('./screens/service').then(m => m.ServicePreviewVue) },
    { path: '/project/:id', component: () => import('./screens/project').then(m => m.ProjectPreviewVue) },
    { path: '/chat', component: () => import('./screens/chat').then(m => m.ChatVue) },
    { path: '/chat/:id', component: () => import('./screens/chat/preview').then(m => m.ChatPreviewVue) },
    { path: '/services', component: () => import('./components/freelancer/services').then(m => m.FreeLancerServicesVue) },
    { path: '/create_service', component: () => import('./components/freelancer/services/create').then(m => m.FreeLancerCreateServiceVue) },
    { path: '/update_service/:id', component: () => import('./components/freelancer/services/update').then(m => m.FreeLancerUpdateServiceVue) },
    { path: '/services/:username', component: () => import('./components/freelancer/services').then(m => m.FreeLancerServicesVue) },
    { path: '/portfolio', component: () => import('./components/freelancer/portfolio').then(m => m.FreeLancerPortfolioVue) },
    { path: '/create_project', component: () => import('./components/freelancer/portfolio/create').then(m => m.FreeLancerCreateProjectVue) },
    { path: '/update_project/:id', component: () => import('./components/freelancer/portfolio/update').then(m => m.FreeLancerUpdateProjectVue) },
    { path: '/portfolio/:username', component: () => import('./components/freelancer/portfolio').then(m => m.FreeLancerPortfolioVue) },
    { path: '/create_job', component: () => import('./components/client/jobs/create').then(m => m.ClientCreateJobVue) },
    { path: '/client/profile', component: () => import('./components/client/profile').then(m => m.ProfileVue) },
    { path: '/all_services', component: () => import('./components/client/services').then(m => m.ClientServicesVue) },
    { path: '/my_jobs', component: () => import('./components/client/jobs/my_jobs').then(m => m.ClientMyjobsVue) },
    { path: '/profile', component: () => import('./components/freelancer/profile').then(m => m.FreeLancerProfileVue) },
    { path: '/update_job/:id', component: () => import('./components/client/jobs/update').then(m => m.ClientUpdateJobVue) },
    { path: '/chat_client_freelancer/', component: () => import('./screens/chat').then(m => m.ChatVue) },
    { path: '/proposals/', component: () => import('./screens/proposal').then(m => m.ProposalsVue) },
    { path: '/create_portfolio/', component: () => import('./components/freelancer/portfolio/create').then(m => m.FreeLancerCreateProjectVue) },
    { path: '/my_purchases/', component: () => import('./components/client/my_purchases').then(m => m.ClientMyPurchasesVue) },
    { path: '/saved_jobs', component: () => import('./components/freelancer/saved_jobs').then(m => m.SavedJobsVue) },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

app.component("Icon", Icon);
app.component("Loading", LoadingVue);
app.component("LoadingSpinner", LoadingSpinnerVue);
app.component("Toast", ToastVue);
app.component("Service", ServiceVue);
app.component("Pagination", PaginationVue);

// WebSocket
const protocol = import.meta.env.MODE == "development" ? "ws" : "wss"; // Use 'wss' in production for secure WebSocket
const ws_host = import.meta.env.MODE == "development" ? "127.0.0.1:8001" : window.location.host;
const ws = new WebSocket(`${protocol}://${ws_host}/ws`);


ws.onopen = () => { console.log("WebSocket connection is open."); }

app.provide("ws", ws);

app.use(router);
app.use(MotionPlugin);
app.mount('#app');