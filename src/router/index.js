import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/User/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/Goods/Cate.vue'
import Params from '../components/Goods/Params.vue'
import GoodsList from '../components/Goods/GoodsList.vue'
import AddGoods from '../components/Goods/AddGoods.vue'
import Orders from '../components/order/Order.vue'

Vue.use(VueRouter)
const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: 'welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: GoodsList },
      { path: '/goods/addGoods', component: AddGoods },
      { path: '/orders', component: Orders }
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, form, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数， 表示放行
  // next() 放行  next('/login') 强制跳转
  if (to.path === '/login') return next()

  const tokenStr = sessionStorage.getItem('token')

  if (!tokenStr) return next('/login')

  next()
})

export default router
