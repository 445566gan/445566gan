// 引用
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Zktable from 'vue-table-with-tree-grid'
import './plugins/element.js'
import './assets/css/base.css'
import axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'
// 副文本样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 使用
Vue.use(VueQuillEditor)
Vue.component('tree-table', Zktable)
    // 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
    // axios拦截器 在接收到数据后做的默认预处理 完成后接要返回
axios.interceptors.request.use(config => {
        console.log(config)
            // 在头部添加服务器的token令牌
        config.headers.Authorization = window.sessionStorage.getItem('token')
        return config
    })
    // 原型对像添加方法
Vue.prototype.$http = axios
    // 定义时间过滤器
Vue.filter('dataForm', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + 1 + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
