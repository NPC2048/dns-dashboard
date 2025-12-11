<script setup lang="ts">
import { ref, reactive } from 'vue'
import { queryDns } from '@/api/dns'
import type { DnsQueryResult } from '@/api/dns'
import { message } from 'ant-design-vue'
import {
  GlobalOutlined,
  SearchOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue'

// 表单数据
const formState = reactive({
  domain: '',
  loading: false
})

// 查询结果 - 初始显示空结果
const queryResult = ref<DnsQueryResult>({
  domain: '',
  success: false,
  errorMessage: '',
  queryTime: new Date().toISOString(),
  queryType: 'A',
  responseTimeMs: 0,
  cacheHit: false,
  ttl: 0,
  ipAddresses: []
})

// 查询历史
const queryHistory = ref<DnsQueryResult[]>([])

// 执行DNS查询
const handleQuery = async () => {
  if (!formState.domain.trim()) {
    message.warning('请输入域名')
    return
  }

  // 简单的域名格式验证
  const domain = formState.domain.trim()
  if (!domain.includes('.') || domain.length < 3 || domain.length > 253) {
    message.warning('请输入有效的域名格式（如：google.com）')
    return
  }

  formState.loading = true
  try {
    const result = await queryDns(formState.domain.trim())
    queryResult.value = result

    // 添加到历史记录（最多保留10条）
    queryHistory.value.unshift(result)
    if (queryHistory.value.length > 10) {
      queryHistory.value = queryHistory.value.slice(0, 10)
    }

    if (result.success) {
      message.success(`查询成功：找到 ${result.ipAddresses?.length || 0} 个IP地址`)
    } else {
      message.error(`查询失败：${result.errorMessage}`)
    }
  } catch (error: any) {
    message.error(`查询失败：${error.message || '未知错误'}`)
    queryResult.value = {
      domain: formState.domain.trim(),
      success: false,
      errorMessage: error.message || '未知错误',
      queryTime: new Date().toISOString(),
      queryType: 'A'
    } as DnsQueryResult
  } finally {
    formState.loading = false
  }
}

// 清空结果
const clearResult = () => {
  queryResult.value = null
}

// 清空历史
const clearHistory = () => {
  queryHistory.value = []
}

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // 降级方案
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    message.success('已复制到剪贴板')
  } catch (error) {
    message.error('复制失败')
  }
}
</script>

<template>
  <div class="dns-test" ref="pageContainer">
    <a-page-header
      title="DNS服务测试"
      sub-title="测试本地DNS服务是否可用"
      @back="() => $router.push('/')"
    >
      <template #extra>
        <a-space>
          <a-button @click="clearResult">清空结果</a-button>
          <a-button @click="clearHistory">清空历史</a-button>
          <a-button @click="() => $router.push('/dashboard')" type="primary">返回仪表盘</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card title="DNS查询" style="margin-top: 24px">
      <a-form :model="formState" layout="inline">
        <a-form-item label="域名" required>
          <a-input
            v-model:value="formState.domain"
            placeholder="输入域名，如：google.com"
            style="width: 300px"
            @press-enter="handleQuery"
          >
            <template #prefix>
              <global-outlined />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            :loading="formState.loading"
            @click="handleQuery"
          >
            <template #icon>
              <search-outlined />
            </template>
            测试查询
          </a-button>
        </a-form-item>
        <a-form-item>
          <a-button @click="formState.domain = ''">
            清空输入
          </a-button>
        </a-form-item>
      </a-form>

      <div style="margin-top: 16px; color: #666; font-size: 14px">
        <info-circle-outlined /> 提示：此功能将使用本地DNS服务（端口5354）查询域名的A记录
      </div>
    </a-card>

    <!-- 查询结果 -->
    <a-card
      :title="queryResult.domain ? `查询结果：${queryResult.domain}` : '查询结果'"
      style="margin-top: 24px"
      :class="queryResult.success ? 'success-card' : 'error-card'"
    >
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="域名">
          {{ queryResult.domain }}
        </a-descriptions-item>
        <a-descriptions-item label="查询类型">
          {{ queryResult.queryType || 'A' }}
        </a-descriptions-item>
        <a-descriptions-item label="查询时间">
          {{ new Date(queryResult.queryTime).toLocaleString() }}
        </a-descriptions-item>
        <a-descriptions-item label="响应时间">
          {{ queryResult.responseTimeMs }} ms
        </a-descriptions-item>
        <a-descriptions-item label="缓存命中">
          <a-tag :color="queryResult.cacheHit ? 'green' : 'orange'">
            {{ queryResult.cacheHit ? '命中' : '未命中' }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="TTL">
          {{ queryResult.ttl }} 秒
        </a-descriptions-item>
        <a-descriptions-item label="状态" :span="2">
          <a-tag :color="queryResult.success ? 'success' : 'error'">
            {{ queryResult.success ? '成功' : '失败' }}
          </a-tag>
          <span v-if="!queryResult.success" style="margin-left: 8px; color: #ff4d4f">
            {{ queryResult.errorMessage }}
          </span>
        </a-descriptions-item>
      </a-descriptions>

      <!-- IP地址列表 -->
      <div v-if="queryResult.success && queryResult.ipAddresses && queryResult.ipAddresses.length > 0" style="margin-top: 16px">
        <h3>IP地址列表（A记录）</h3>
        <a-list
          :data-source="queryResult.ipAddresses"
          bordered
          size="small"
        >
          <template #renderItem="{ item, index }">
            <a-list-item>
              <a-list-item-meta>
                <template #title>
                  <a-tag color="blue">{{ index + 1 }}</a-tag>
                  <code style="font-size: 16px; margin-left: 8px">{{ item }}</code>
                </template>
                <template #description>
                  <span style="font-size: 12px; color: #999">IPv4 地址</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a-button type="link" size="small" @click="() => copyToClipboard(item)">
                  复制
                </a-button>
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>

      <div v-else-if="queryResult.success" style="margin-top: 16px; color: #999">
        未找到A记录
      </div>
    </a-card>

    <!-- 查询历史 -->
    <a-card v-if="queryHistory.length > 0" title="查询历史（最近10条）" style="margin-top: 24px">
      <a-list
        :data-source="queryHistory"
        bordered
        size="small"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta>
              <template #title>
                <a-tag :color="item.success ? 'green' : 'red'" size="small">
                  {{ item.success ? '成功' : '失败' }}
                </a-tag>
                <span style="margin-left: 8px">{{ item.domain }}</span>
              </template>
              <template #description>
                <span style="font-size: 12px">
                  时间：{{ new Date(item.queryTime).toLocaleString() }} |
                  响应：{{ item.responseTimeMs }} ms |
                  缓存：{{ item.cacheHit ? '命中' : '未命中' }} |
                  IP数量：{{ item.success ? (item.ipAddresses?.length || 0) : 0 }}
                </span>
              </template>
            </a-list-item-meta>
            <template #actions>
              <a-button type="link" size="small" @click="() => { formState.domain = item.domain; handleQuery() }">
                重试
              </a-button>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-card>

    <!-- 使用说明 -->
    <a-card title="使用说明" style="margin-top: 24px">
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="功能说明">
          此页面用于测试本地DNS服务的可用性。输入域名后，系统将使用本地DNS服务器（端口5354）查询A记录。
        </a-descriptions-item>
        <a-descriptions-item label="返回信息">
          <ul style="margin: 0; padding-left: 16px">
            <li><strong>IP地址列表</strong>：域名解析出的IPv4地址</li>
            <li><strong>TTL</strong>：生存时间，表示结果在缓存中保存的秒数</li>
            <li><strong>缓存命中</strong>：查询是否命中本地缓存</li>
            <li><strong>响应时间</strong>：从发送查询到收到响应的毫秒数</li>
          </ul>
        </a-descriptions-item>
        <a-descriptions-item label="注意事项">
          <ul style="margin: 0; padding-left: 16px">
            <li>请确保本地DNS服务正在运行（端口5354）</li>
            <li>如查询失败，请检查后端服务状态</li>
            <li>缓存命中率受DNS缓存配置影响</li>
            <li>TTL值来源于上游DNS服务器的响应</li>
          </ul>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<style scoped>
.dns-test {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 48px);
  overflow-y: auto;
}

.success-card {
  border-left: 4px solid #52c41a;
}

.error-card {
  border-left: 4px solid #ff4d4f;
}

:deep(.ant-list-item) {
  padding: 12px 16px;
}

:deep(.ant-descriptions-item-label) {
  width: 120px;
  font-weight: 500;
}
</style>