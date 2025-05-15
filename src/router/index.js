import { createRouter, createWebHistory } from 'vue-router'

// 示例路由，可根据实际页面修改
// { path: '/', component: () => import('../components/ChatTest.vue') }

const routes = [
  {
    path: '/',
    component: () => import('../components/ChatTest.vue')
  },
  {
    path: '/report',
    component: () => import('../components/Report.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/xiaomeitaste/'),
  routes
})

export default router 