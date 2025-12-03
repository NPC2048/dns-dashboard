# Vue Router 配置使用说明

## 概述

已成功为 DNS 服务器管理系统配置了 Vue Router 4.x，实现了完整的路由功能、侧边栏导航和响应式布局。

## 访问地址

开发服务器已启动：**http://localhost:5175**

## 路由配置

### 路由结构
```
/                 - 首页 (HomePage)
/dashboard        - 仪表盘 (Dashboard)
/cache            - 缓存管理 (CacheManagement)
/config           - 系统配置 (Configuration)
/demo             - Ant Design Vue 组件演示 (AntdDemo)
/*                - 404 页面重定向到首页
```

### 路由配置文件
- `src/router/index.ts` - 主路由配置
- `src/views/` - 页面组件目录
- `src/components/` - 可复用组件目录

## 功能特性

### 1. 侧边栏导航
- 响应式折叠/展开
- 深色主题
- 自动高亮当前路由
- 图标支持

### 2. 页面布局
- Ant Design Vue Layout 组件
- 头部显示当前页面标题
- 底部版权信息
- 响应式设计

### 3. 路由守卫
- 全局前置守卫：设置页面标题
- 全局后置守卫：可添加访问统计
- 滚动行为控制

### 4. 页面组件
#### 首页 (`/`)
- 系统概览
- 功能导航卡片
- 技术栈介绍
- 快速开始指南

#### 仪表盘 (`/dashboard`)
- 实时统计数据
- 查询类型分布
- Top 5 查询域名
- 缓存命中率图表
- 模拟实时数据更新（每3秒）

#### 缓存管理 (`/cache`)
- 缓存条目表格
- 搜索和筛选功能
- 批量操作
- 缓存统计信息
- 导入/导出功能

#### 系统配置 (`/config`)
- 上游 DNS 配置
- 缓存参数设置
- 网络配置
- 日志配置
- 安全配置
- 标签页分类

#### 组件演示 (`/demo`)
- Ant Design Vue 组件展示
- 表单、表格、模态框等
- 交互式示例

## 技术实现

### 1. 路由配置 (`src/router/index.ts`)
```typescript
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: {
      title: '首页 - DNS 服务器管理'
    }
  },
  // ... 其他路由
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})
```

### 2. 布局组件 (`src/App.vue`)
- 使用 Ant Design Vue 的 Layout 组件
- 响应式侧边栏
- 动态菜单项
- 路由监听和状态同步

### 3. 路径别名配置 (`vite.config.ts`)
```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url))
  }
}
```

### 4. 图标配置 (`src/main.ts`)
```typescript
// 注册所有图标
const icons = Icons
for (const iconName in icons) {
  if (iconName.endsWith('Outlined')) {
    app.component(iconName, icons[iconName as keyof typeof icons])
  }
}
```

## 开发指南

### 添加新页面
1. 在 `src/views/` 目录创建新的 Vue 组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/App.vue` 的 `menuItems` 中添加菜单项（可选）

### 路由跳转
```vue
<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 编程式导航
const navigateToDashboard = () => {
  router.push('/dashboard')
}

// 带参数跳转
const navigateWithParams = () => {
  router.push({
    path: '/detail',
    query: { id: '123' }
  })
}
</script>

<template>
  <!-- 声明式导航 -->
  <router-link to="/dashboard">仪表盘</router-link>
</template>
```

### 获取路由信息
```vue
<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

// 获取当前路由信息
console.log(route.path)      // 当前路径
console.log(route.name)      // 路由名称
console.log(route.params)    // 路由参数
console.log(route.query)     // 查询参数
console.log(route.meta)      // 路由元信息
</script>
```

### 路由守卫
```typescript
// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 权限检查
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})

// 路由独享守卫
{
  path: '/admin',
  component: AdminPage,
  beforeEnter: (to, from, next) => {
    // 页面级权限检查
    if (hasAdminAccess()) {
      next()
    } else {
      next('/403')
    }
  }
}
```

## 文件结构

```
src/
├── router/
│   └── index.ts          # 路由配置
├── views/                # 页面组件
│   ├── HomePage.vue      # 首页
│   ├── Dashboard.vue     # 仪表盘
│   ├── CacheManagement.vue # 缓存管理
│   └── Configuration.vue # 系统配置
├── components/           # 可复用组件
│   ├── AntdDemo.vue      # 组件演示
│   └── HelloWorld.vue    # 示例组件
├── App.vue              # 根组件（布局）
└── main.ts             # 应用入口
```

## 样式说明

### 布局样式
- 使用 Ant Design Vue 的 Layout 组件
- 侧边栏：深色主题，可折叠
- 内容区：白色背景，内边距
- 响应式设计

### 自定义样式
- `src/style.css` - 全局样式重置
- 组件内使用 `<style scoped>` 局部样式
- Ant Design Vue 的主题可通过 CSS 变量自定义

## 扩展建议

### 1. 添加路由懒加载
```typescript
const HomePage = () => import('@/views/HomePage.vue')
const Dashboard = () => import('@/views/Dashboard.vue')
```

### 2. 添加权限控制
```typescript
// 路由元信息中添加权限字段
meta: {
  title: '仪表盘',
  requiresAuth: true,
  roles: ['admin', 'user']
}

// 在路由守卫中检查权限
```

### 3. 添加面包屑导航
使用 Ant Design Vue 的 Breadcrumb 组件实现面包屑导航。

### 4. 添加页面过渡动画
```vue
<router-view v-slot="{ Component }">
  <transition name="fade" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
```

### 5. 添加路由进度条
使用 nprogress 库显示页面加载进度。

## 故障排除

### 1. 路由不生效
- 检查 `main.ts` 中是否正确注册了路由
- 检查 `App.vue` 中是否有 `<router-view />`
- 检查路由配置路径是否正确

### 2. 页面组件找不到
- 检查 `vite.config.ts` 中的路径别名配置
- 检查组件导入路径是否正确
- 检查组件文件是否存在

### 3. 图标不显示
- 检查是否安装了 `@ant-design/icons-vue`
- 检查 `main.ts` 中是否正确注册了图标
- 检查图标组件名称是否正确

### 4. 样式问题
- 检查是否引入了 `ant-design-vue/dist/reset.css`
- 检查是否有样式冲突
- 检查组件是否使用了正确的类名

## 性能优化

### 1. 路由懒加载
将页面组件改为异步加载，减少初始包大小。

### 2. 组件缓存
```vue
<router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>
```

### 3. 滚动位置恢复
已在路由配置中启用 `scrollBehavior`，恢复滚动位置。

---

**提示**：这个路由配置为 DNS 服务器管理系统提供了完整的导航结构，可以轻松扩展新的功能页面。