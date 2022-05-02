import { createRouter, createWebHistory } from "vue-router";

import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "/index",

    name: "Index",
    component: () => import("../views/web/Index.vue"),
  },
  {
    path: "/news",
    name: "news",
    component: () => import("../views/web/news.vue"),
  },
  {
    path: "/news/:id",
    name: "newsDetail",
    component: () => import("../views/web/newsDetail.vue"),
    },
    {
        path:'/product',
        name:'product',
        component:()=>import('../views/web/product.vue')
    },{
        path: '/job',
        name: 'job',
        component:()=>import('../views/web/job.vue')
    },
    {
        path: '/job/:id',
        name: 'jobDetail',
        component:()=>import("../views/web/jobDetail.vue")
    }, {
        path: '/login',
        name: 'login',
        component:()=>import('../views/web/login.vue')
    }
];

const router = createRouter({
  routes: routes,
  history: createWebHistory(),
});

export default router;
