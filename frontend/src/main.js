import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import RestInfo from './libs/RestInfo';
import axios from 'axios';
import { createRouter, createWebHashHistory } from 'vue-router';
import { HomeVue } from './screens/home';


const app = createApp(App);

const restInfo = new RestInfo(axios);

app.provide('restInfo', restInfo);

const routes = [
    { path: '/', component: HomeVue },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

app.use(router);
app.mount('#app')
