import { createApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
import router from './router'

import '@/assets/main.scss'

const app = createApp(App)

app.use(router).use(pinia).mount('#app')
