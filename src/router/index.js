import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
// 导入需要前置守卫拦截的 hash 地址
import pathArr from '@/router/pathArr.js'
const routes = [
  // 重定向的路由规则
  { path: '/home', redirect: '/' },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'admin',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited. 路由懒加载
    component: () => import(/* webpackChunkName: "about" */ '../views/AdminView.vue')
  },
  {
    path: '/login',
    name: 'login',
    // 路由懒加载
    component: () => import(/* webpackChunkName: "about" */ '../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
  // 如果没有 token，则强制跳转到 /login 登录页
  // console.log(to)
  if (pathArr.indexOf(to.name) !== -1) {
    // console.log(11)
    // 要访问后台主页，需要判断是否有 token
    const token = localStorage.getItem('token')
    if (token) {
      return true
    } else {
      // 没有登录，强制跳转到登录页
      // 将用户重定向到登录页面
      return { name: 'login' }
    }
  } else {
    return true
  }
})

export default router
