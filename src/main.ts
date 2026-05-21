import { createApp } from 'vue'
import App from './App.vue'
import pinia from './store'
import router from './router'
import './style/index.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入路由鉴权
import './permission'
import Category from '@/components/category/index.vue'
//引入自定义指令
import { isHasButton } from './directive/has'
const app = createApp(App)

isHasButton(app)

//注册全局组件
app.component('Category', Category)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(router)
app.mount('#app')
