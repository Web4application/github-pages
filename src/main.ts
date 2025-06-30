import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style/global.css'
import './style/tailwind.css'

createApp(App).use(router).mount('#app')
