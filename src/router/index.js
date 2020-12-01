import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

import axios from 'axios'
Vue.use(VueRouter)

// 配置axios的请求根路径
axios.defaults.baseURL = 'http://8.131.91.46:7000/api/private/v1'
Vue.prototype.$http = axios // 将axois赋值给Vue原型，并给原型添加一个属性$http

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }

]

const router = new VueRouter({
  routes
})

export default router
