import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { HomeVue } from './screens/home';
import { SignInVue } from './screens/sign_in';
import { SignUpVue } from './screens/sign_up';
import UserSessionRepository from './libs/UserSessionRepository';
import RestUserSession from './libs/RestUserSession';
import axios from 'axios';


const app = createApp(App);

const routes = [
    { path: '/', component: HomeVue },
    { path: '/sign_in', component: SignInVue },
    { path: '/sign_up', component: SignUpVue },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


const PROTECTED_ROUTES = ['/'];

router.beforeEach(async (to, from) => {
    if(PROTECTED_ROUTES.includes(to.path)){
        let userSessionRepository = new UserSessionRepository(localStorage);
        let restUserSession = new RestUserSession(axios);
        let access_token = userSessionRepository.getAccessToken();
        
        if(!access_token){
            return { path: '/sign_in' };
        }

        try {
            let response = await restUserSession.checkAuth(access_token);
            if(response.error){
                userSessionRepository.clear();
                return { path: 'sign_in' };
            }
        } catch (error) {
            console.log(error);
        }
        
    }
});

app.use(router);
app.mount('#app');
