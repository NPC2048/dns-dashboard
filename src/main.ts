import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// 引入 Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

// 引入 Ant Design Vue 图标
import * as Icons from '@ant-design/icons-vue'

// 引入路由
import router from './router'

const app = createApp(App)

// 注册 Pinia
const pinia = createPinia()
app.use(pinia)

// 注册 Ant Design Vue
app.use(Antd)

// 注册所有图标
const icons = Icons
for (const iconName in icons) {
  if (iconName.endsWith('Outlined')) {
    app.component(iconName, icons[iconName as keyof typeof icons])
  }
}

// 注册路由
app.use(router)

app.mount('#app')
