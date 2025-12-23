import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 页面组件
import HomePage from '@/views/HomePage.vue'
import Dashboard from '@/views/Dashboard.vue'
import CacheManagement from '@/views/CacheManagement.vue'
import Configuration from '@/views/Configuration.vue'
import DnsTest from '@/views/DnsTest.vue'
import Login from '@/views/Login.vue'

// 扩展路由meta类型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    hideLayout?: boolean  // 添加hideLayout选项
  }
}

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
    path: '/dns-test',
    name: 'DnsTest',
    component: DnsTest,
    meta: {
      title: 'DNS服务测试'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登录 - DNS 服务器管理',
      hideLayout: true  // 登录页不使用主布局
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

  // 检查是否需要登录
  const publicPages = ['/', '/login']
  const token = localStorage.getItem('token')

  // 如果访问需要登录的页面但没有token，跳转到登录页
  if (!publicPages.includes(to.path) && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 如果已经登录但访问登录页，跳转到首页
  if (to.path === '/login' && token) {
    return next({ path: '/' })
  }

  next()
})

// 全局后置钩子
router.afterEach((_to, _from) => {
  // 可以在这里添加页面访问统计等
})

export default router