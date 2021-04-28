// 引用
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/base.css'
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
    // 原型对像添加方法
Vue.prototype.$http = axios
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
