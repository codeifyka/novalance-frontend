import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import RestInfo from './libs/RestInfo'
import axios from 'axios'


const app = createApp(App);

const restInfo = new RestInfo(axios);

app.provide('restInfo', restInfo);

app.mount('#app')
