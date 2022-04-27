import { createRouter, createWebHistory } from 'vue-router'

import type { RouteRecordRaw } from 'vue-router'

const routes = [{
    path:'/',
    redirect:'/index'
},{
    path:'/index',
    
    name: "Index",
    component:()=>import('../views/web/Index.vue')
}]

const router = createRouter({
    routes: routes,
    history: createWebHistory()
})

export default router