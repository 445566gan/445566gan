import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users/Users.vue'
import Rights from '../components/Rights/Rights.vue'
import Roles from '../components/Rights/Roles.vue'
import Goods from '../components/goods/goods_cards.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/goods_list.vue'
import AddGoods from '../components/goods/Add.vue'
import Order from '../components/order/Order.vue'
import Report from '../components/report/Report.vue'
Vue.use(VueRouter)
const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            { path: '/welcome', component: Welcome },
            { path: '/users', component: Users },
            { path: '/rights', component: Rights },
            { path: '/roles', component: Roles },
            { path: '/goods', component: Goods },
            { path: '/params', component: Params },
            { path: '/goodslist', component: GoodsList },
            { path: '/goods/add', component: AddGoods },
            { path: '/orders', component: Order },
            { path: '/report', component: Report }
        ]
    }
]
const router = new VueRouter({
        routes
    })
    // VueRouter的守卫方法
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表要从哪个路径跳转而来
    // next 是一个函数 next()放行 next('/login')强制跳转
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router
