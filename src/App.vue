<script setup lang="ts">
import { ref, watch, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  SettingOutlined,
  CodeOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const collapsed = ref(false)

// 当前选中的菜单项
const selectedKeys = ref<string[]>([route.path])
const openKeys = ref<string[]>([])

// 监听路由变化更新菜单选中状态
watch(
  () => route.path,
  (newPath) => {
    selectedKeys.value = [newPath]
  }
)

// 菜单项配置
const menuItems = [
  {
    key: '/',
    icon: () => h(HomeOutlined),
    label: '首页',
    title: '首页',
  },
  {
    key: '/dashboard',
    icon: () => h(DashboardOutlined),
    label: '仪表盘',
    title: '仪表盘',
  },
  {
    key: '/cache',
    icon: () => h(DatabaseOutlined),
    label: '缓存管理',
    title: '缓存管理',
  },
  {
    key: '/config',
    icon: () => h(SettingOutlined),
    label: '系统配置',
    title: '系统配置',
  },
  {
    key: '/demo',
    icon: () => h(CodeOutlined),
    label: '组件演示',
    title: '组件演示',
  },
]

// 菜单点击处理
const handleMenuClick = ({ key }: { key: string }) => {
  router.push(key)
}
</script>

<template>
  <a-layout style="min-height: 100vh">
    <!-- 侧边栏 -->
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        <h2 v-if="!collapsed">DNS Server</h2>
        <h2 v-else>DNS</h2>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <!-- 主内容区 -->
    <a-layout>
      <!-- 头部 -->
      <a-layout-header style="background: #fff; padding: 0 16px">
        <div style="display: flex; align-items: center; justify-content: space-between">
          <div>
            <a-button
              type="text"
              @click="collapsed = !collapsed"
              :icon="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined"
            />
            <span style="margin-left: 16px; font-size: 16px; font-weight: 500">
              {{ route.meta?.title || 'DNS 服务器管理' }}
            </span>
          </div>
          <div>
            <a-space>
              <a-button type="text" @click="() => router.push('/')">
                <template #icon><HomeOutlined /></template>
                首页
              </a-button>
              <a-button type="text" @click="() => router.push('/demo')">
                <template #icon><CodeOutlined /></template>
                组件演示
              </a-button>
            </a-space>
          </div>
        </div>
      </a-layout-header>

      <!-- 内容区 -->
      <a-layout-content style="margin: 16px">
        <div style="padding: 24px; background: #fff; min-height: 360px">
          <router-view />
        </div>
      </a-layout-content>

      <!-- 底部 -->
      <a-layout-footer style="text-align: center">
        DNS Server Management ©2025 Created with Vue 3 + Ant Design Vue
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px;
  border-radius: 4px;
}

.logo h2 {
  color: white;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
</style>
