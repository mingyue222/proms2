import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/styles/style.css'

import 'element-ui/lib/theme-chalk/index.css'

import './util/request.js'

import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false
Vue.component('tree-table', ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
