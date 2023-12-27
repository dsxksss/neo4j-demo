import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Toast, { POSITION } from "vue-toastification";
import './index.css'
import "vue-toastification/dist/index.css";
import router from "./router.js"

const options = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 3,
    newestOnTop: true,
    position: POSITION.BOTTOM_CENTER,
    hideProgressBar: true,
    timeout: 3500
};

createApp(App)
    .use(router)
    .use(ElementPlus)
    .use(Toast, options)
    .mount('#app')
