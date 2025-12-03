<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="home-page">
    <a-typography-title :level="1">DNS 服务器管理系统</a-typography-title>
    <a-typography-paragraph>
      这是一个完整的 DNS 服务器管理系统，采用前后端分离架构。
    </a-typography-paragraph>

    <a-divider>功能导航</a-divider>

    <a-row :gutter="16" style="margin-bottom: 24px">
      <a-col :span="6">
        <a-card hoverable @click="navigateTo('/dashboard')">
          <template #cover>
            <div style="padding: 20px; text-align: center">
              <dashboard-outlined style="font-size: 48px; color: #1890ff" />
            </div>
          </template>
          <a-card-meta title="仪表盘" description="查看实时统计数据和图表">
            <template #avatar>
              <dashboard-outlined />
            </template>
          </a-card-meta>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card hoverable @click="navigateTo('/cache')">
          <template #cover>
            <div style="padding: 20px; text-align: center">
              <database-outlined style="font-size: 48px; color: #52c41a" />
            </div>
          </template>
          <a-card-meta title="缓存管理" description="管理 DNS 缓存条目">
            <template #avatar>
              <database-outlined />
            </template>
          </a-card-meta>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card hoverable @click="navigateTo('/config')">
          <template #cover>
            <div style="padding: 20px; text-align: center">
              <setting-outlined style="font-size: 48px; color: #722ed1" />
            </div>
          </template>
          <a-card-meta title="系统配置" description="配置上游 DNS 和缓存参数">
            <template #avatar>
              <setting-outlined />
            </template>
          </a-card-meta>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card hoverable @click="navigateTo('/demo')">
          <template #cover>
            <div style="padding: 20px; text-align: center">
              <code-outlined style="font-size: 48px; color: #fa8c16" />
            </div>
          </template>
          <a-card-meta title="组件演示" description="Ant Design Vue 组件示例">
            <template #avatar>
              <code-outlined />
            </template>
          </a-card-meta>
        </a-card>
      </a-col>
    </a-row>

    <a-divider>系统信息</a-divider>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="技术栈">
          <a-descriptions :column="1" bordered>
            <a-descriptions-item label="前端">
              Vue 3.5 + TypeScript + Ant Design Vue 4.x
            </a-descriptions-item>
            <a-descriptions-item label="后端">
              Spring Boot 4.0 + WebFlux + Java 21
            </a-descriptions-item>
            <a-descriptions-item label="构建工具">
              Vite 7.x + Maven
            </a-descriptions-item>
            <a-descriptions-item label="包管理器">
              pnpm 10.x
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="快速开始">
          <a-steps direction="vertical" size="small">
            <a-step title="启动后端服务" description="在 dns-backend 目录运行 mvn spring-boot:run" />
            <a-step title="启动前端服务" description="在 dns-front 目录运行 pnpm dev" />
            <a-step title="访问管理界面" description="打开 http://localhost:5173" />
            <a-step title="测试 DNS 服务" description="使用 dig 或 nslookup 测试 DNS 查询" />
          </a-steps>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.ant-card {
  cursor: pointer;
  transition: all 0.3s;
}

.ant-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
</style>