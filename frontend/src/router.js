import { createRouter, createWebHistory } from "vue-router"
import Home from "./pages/Home.vue"
import Graph from "./pages/Graph.vue"
import NotFound from "./pages/NotFound.vue"

const routesMap = [
    { path: '/:pathMatch(.*)', component: NotFound },
    { path: '/', component: Home },
    { path: '/graph', component: Graph },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routesMap
})

export default router