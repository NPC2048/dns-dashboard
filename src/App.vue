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
    key: '/dns-test',
    icon: () => h(CodeOutlined),
    label: 'DNS测试',
    title: 'DNS服务测试',
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
        <div class="header-content">
          <div class="header-left">
            <a-button
              type="text"
              @click="collapsed = !collapsed"
              class="collapse-btn"
            >
              <template #icon>
                <component :is="collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
              </template>
            </a-button>
            <span class="header-title">
              {{ route.meta?.title || 'DNS 服务器管理' }}
            </span>
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

/* 头部样式 */
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  font-size: 16px;
  flex-shrink: 0;
}

.header-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 300px;
  flex-shrink: 0;
}

/* 确保按钮图标正确显示 */
.ant-btn-text .anticon {
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 防止布局溢出 */
.ant-layout-header {
  overflow: hidden;
}

/* 确保按钮内容不换行 */
.ant-btn-text {
  white-space: nowrap;
}
</style>
