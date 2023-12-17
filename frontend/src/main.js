import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'
import Toast, { POSITION } from "vue-toastification";
import './index.css'
import "vue-toastification/dist/index.css";

const options = {
    transition: "Vue-Toastification__bounce",
    maxToasts: 3,
    newestOnTop: true,
    position: POSITION.BOTTOM_CENTER,
    hideProgressBar: true,
    timeout: 3500
};

createApp(App)
    .use(naive)
    .use(Toast, options)
    .mount('#app')
