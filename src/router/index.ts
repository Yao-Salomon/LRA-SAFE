import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path:'/login',
      name:'login',
      component:()=> import('../views/login/LoginView.vue')
    },
    {
      path:'/signup',
      name:'signup',
      component:()=> import('../views/login/SignUpView.vue')
    },
    {
      path:'/404',
      name:'404',
      component:()=> import('../views/login/404View.vue')
    },
    {
      path:'/account',
      name:'account',
      component:()=> import('../views/account/AccountView.vue')
    },
    {
      path:'/dashboard',
      name:'dashboard',
      component:()=> import('../views/account/DashboardView.vue')
    },
    {
      path:'/password',
      name:'password',
      component:()=> import('../views/account/ChangePasswordView.vue')
    },
    {
      path:'/feedback',
      name:'feedback',
      component:()=> import('../views/account/FeedbackView.vue')
    },
    {
      path:'/order',
      name:'order',
      component:()=> import('../views/works/OrderView.vue')
    },
    {
      path:'/notifications',
      name:'notifications',
      component:()=> import('../views/account/NotificationView.vue')
    },
    {
      path:'/reports',
      name:'report',
      component:()=> import('../views/works/ReportsView.vue')
    }
  ]
})

export default router
