import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import OrderListView from '../views/OrderListView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/orders' },
    { path: '/login', component: LoginView },
    { path: '/orders', component: OrderListView },
  ],
})

export default router
