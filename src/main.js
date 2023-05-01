import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from '@/api/axiosConfig.js'
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
  .use(ElementPlus)
  .use(router)

// app.config.globalProperties.$http = axios

app.provide('$http', axios)
app.mount('#app')
