import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/styles/style.css'

import 'element-ui/lib/theme-chalk/index.css'

import './util/request.js'
import './util/time.js'

// 导入富文本框
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本框的使用样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'

import './assets/fonts/iconfont.css'
import ZkTable from 'vue-table-with-tree-grid' // for bubble theme

// 挂载富文本框
Vue.use(VueQuillEditor)

Vue.config.productionTip = false
Vue.component('tree-table', ZkTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
