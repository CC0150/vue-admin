import { createApp, defineAsyncComponent } from 'vue'
import App from './App.vue'
import pinia from './store'
import router from './router'
import './style/index.scss'
// 按需导入图标（仅注册项目实际使用的图标，约 31 个，而非全量 ~300 个）
import {
  Expand, Fold, Refresh, FullScreen, Setting, ArrowRight, Moon, Sunny,
  Promotion, HomeFilled, Warning, Platform, Lock, User, UserFilled,
  Monitor, Goods, ShoppingCartFull, ChromeFilled, Calendar, Orange, DataLine,
  Plus, Edit, Delete, Bottom, Top, InfoFilled, View, Money,
} from '@element-plus/icons-vue'
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//引入路由鉴权
import './permission'
//引入自定义指令
import { isHasButton } from './directive/has'
const app = createApp(App)

isHasButton(app)

// 全局组件按需异步加载，避免首屏拉取非必要组件
app.component('Category', defineAsyncComponent(() => import('@/components/category/index.vue')))

// 注册项目实际使用的图标（字符串 icon prop 和动态 <component :is> 需要全局注册）
const icons: Record<string, object> = {
  Expand, Fold, Refresh, FullScreen, Setting, ArrowRight, Moon, Sunny,
  Promotion, HomeFilled, Warning, Platform, Lock, User, UserFilled,
  Monitor, Goods, ShoppingCartFull, ChromeFilled, Calendar, Orange, DataLine,
  Plus, Edit, Delete, Bottom, Top, InfoFilled, View, Money,
}
for (const [key, component] of Object.entries(icons)) {
  app.component(key, component)
}
app.use(pinia)
app.use(router)
app.mount('#app')
