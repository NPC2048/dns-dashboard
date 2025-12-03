import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 页面组件（稍后创建）
import HomePage from '@/views/HomePage.vue'
import AntdDemo from '@/components/AntdDemo.vue'
import Dashboard from '@/views/Dashboard.vue'
import CacheManagement from '@/views/CacheManagement.vue'
import Configuration from '@/views/Configuration.vue'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: '首页 - DNS 服务器管理'
    }
  },
  {
    path: '/demo',
    name: 'Demo',
    component: AntdDemo,
    meta: {
      title: 'Ant Design Vue Demo'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: '仪表盘 - DNS 统计'
    }
  },
  {
    path: '/cache',
    name: 'Cache',
    component: CacheManagement,
    meta: {
      title: '缓存管理'
    }
  },
  {
    path: '/config',
    name: 'Config',
    component: Configuration,
    meta: {
      title: '系统配置'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

// 全局后置钩子
router.afterEach((_to, _from) => {
  // 可以在这里添加页面访问统计等
})

export default router