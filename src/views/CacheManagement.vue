<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { TableColumnsType } from 'ant-design-vue'

const router = useRouter()

// 缓存数据
interface CacheEntry {
  key: string
  domain: string
  ip: string
  ttl: number
  expireTime: string
  queryCount: number
  lastAccess: string
}

const cacheData = ref<CacheEntry[]>([
  {
    key: '1',
    domain: 'google.com',
    ip: '142.250.185.78',
    ttl: 300,
    expireTime: '2025-12-03 10:30:00',
    queryCount: 1234,
    lastAccess: '2025-12-03 09:45:12',
  },
  {
    key: '2',
    domain: 'github.com',
    ip: '140.82.121.3',
    ttl: 600,
    expireTime: '2025-12-03 11:15:00',
    queryCount: 987,
    lastAccess: '2025-12-03 09:42:33',
  },
  {
    key: '3',
    domain: 'stackoverflow.com',
    ip: '151.101.193.69',
    ttl: 1800,
    expireTime: '2025-12-03 12:30:00',
    queryCount: 765,
    lastAccess: '2025-12-03 09:38:21',
  },
  {
    key: '4',
    domain: 'npmjs.com',
    ip: '104.16.103.5',
    ttl: 3600,
    expireTime: '2025-12-03 13:45:00',
    queryCount: 543,
    lastAccess: '2025-12-03 09:35:44',
  },
  {
    key: '5',
    domain: 'vuejs.org',
    ip: '104.248.78.213',
    ttl: 7200,
    expireTime: '2025-12-03 15:00:00',
    queryCount: 432,
    lastAccess: '2025-12-03 09:32:15',
  },
  {
    key: '6',
    domain: 'ant.design',
    ip: '36.156.69.91',
    ttl: 86400,
    expireTime: '2025-12-04 09:30:00',
    queryCount: 321,
    lastAccess: '2025-12-03 09:28:47',
  },
  {
    key: '7',
    domain: 'vitejs.dev',
    ip: '76.76.21.21',
    ttl: 1800,
    expireTime: '2025-12-03 12:30:00',
    queryCount: 210,
    lastAccess: '2025-12-03 09:25:39',
  },
  {
    key: '8',
    domain: 'typescriptlang.org',
    ip: '13.107.42.14',
    ttl: 3600,
    expireTime: '2025-12-03 13:45:00',
    queryCount: 198,
    lastAccess: '2025-12-03 09:22:11',
  },
])

// 表格列配置
const columns: TableColumnsType = [
  {
    title: '域名',
    dataIndex: 'domain',
    key: 'domain',
    sorter: (a: CacheEntry, b: CacheEntry) => a.domain.localeCompare(b.domain),
  },
  {
    title: 'IP 地址',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: 'TTL (秒)',
    dataIndex: 'ttl',
    key: 'ttl',
    sorter: (a: CacheEntry, b: CacheEntry) => a.ttl - b.ttl,
  },
  {
    title: '过期时间',
    dataIndex: 'expireTime',
    key: 'expireTime',
  },
  {
    title: '查询次数',
    dataIndex: 'queryCount',
    key: 'queryCount',
    sorter: (a: CacheEntry, b: CacheEntry) => a.queryCount - b.queryCount,
  },
  {
    title: '最后访问',
    dataIndex: 'lastAccess',
    key: 'lastAccess',
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
  },
]

// 搜索表单
const searchForm = reactive({
  domain: '',
  ip: '',
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: cacheData.value.length,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`,
})

// 选中的行
const selectedRowKeys = ref<string[]>([])

// 操作函数
const handleSearch = () => {
  console.log('搜索:', searchForm)
}

const handleReset = () => {
  searchForm.domain = ''
  searchForm.ip = ''
}

const handleDelete = (key: string) => {
  cacheData.value = cacheData.value.filter(item => item.key !== key)
  pagination.total = cacheData.value.length
}

const handleBatchDelete = () => {
  cacheData.value = cacheData.value.filter(item => !selectedRowKeys.value.includes(item.key))
  selectedRowKeys.value = []
  pagination.total = cacheData.value.length
}

const handleClearAll = () => {
  cacheData.value = []
  selectedRowKeys.value = []
  pagination.total = 0
}

const handleRefresh = () => {
  // 模拟刷新数据
  console.log('刷新缓存数据')
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="cache-management">
    <a-page-header
      title="缓存管理"
      sub-title="DNS 缓存条目管理"
      @back="() => router.push('/')"
    >
      <template #extra>
        <a-space>
          <a-button @click="navigateTo('/dashboard')">返回仪表盘</a-button>
          <a-button @click="navigateTo('/config')" type="primary">系统配置</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-card style="margin-top: 24px; margin-bottom: 24px">
      <a-form layout="inline" :model="searchForm">
        <a-form-item label="域名">
          <a-input
            v-model:value="searchForm.domain"
            placeholder="输入域名搜索"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="IP 地址">
          <a-input
            v-model:value="searchForm.ip"
            placeholder="输入 IP 地址搜索"
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">
              <template #icon><search-outlined /></template>
              搜索
            </a-button>
            <a-button @click="handleReset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>

    <a-card>
      <template #title>
        <a-space>
          <span>缓存条目列表</span>
          <a-tag color="blue">共 {{ pagination.total }} 条</a-tag>
        </a-space>
      </template>

      <template #extra>
        <a-space>
          <a-button @click="handleRefresh" :loading="false">
            <template #icon><reload-outlined /></template>
            刷新
          </a-button>
          <a-button
            type="primary"
            danger
            :disabled="selectedRowKeys.length === 0"
            @click="handleBatchDelete"
          >
            <template #icon><delete-outlined /></template>
            批量删除
          </a-button>
          <a-button type="primary" danger @click="handleClearAll">
            <template #icon><clear-outlined /></template>
            清空缓存
          </a-button>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="cacheData"
        :pagination="pagination"
        :row-selection="{
          selectedRowKeys,
          onChange: (keys: string[]) => {
            selectedRowKeys.value = keys
          },
        }"
        row-key="key"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="() => console.log('查看', record)">
                查看
              </a-button>
              <a-button
                type="link"
                size="small"
                danger
                @click="() => handleDelete(record.key)"
              >
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-row :gutter="16" style="margin-top: 24px">
      <a-col :span="12">
        <a-card title="缓存统计">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="总缓存条目">
              {{ cacheData.length }}
            </a-descriptions-item>
            <a-descriptions-item label="内存占用">
              {{ Math.round(cacheData.length * 0.5) }} KB
            </a-descriptions-item>
            <a-descriptions-item label="平均 TTL">
              {{ Math.round(cacheData.reduce((sum, item) => sum + item.ttl, 0) / cacheData.length) }} 秒
            </a-descriptions-item>
            <a-descriptions-item label="总查询次数">
              {{ cacheData.reduce((sum, item) => sum + item.queryCount, 0) }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="缓存操作">
          <a-space direction="vertical" style="width: 100%">
            <a-alert
              message="缓存操作提示"
              description="删除缓存条目将强制重新从上游 DNS 查询，可能会影响查询性能。"
              type="info"
              show-icon
            />
            <a-button block @click="handleRefresh">
              <template #icon><sync-outlined /></template>
              手动刷新所有缓存
            </a-button>
            <a-button block type="dashed" @click="() => console.log('导出缓存')">
              <template #icon><export-outlined /></template>
              导出缓存数据
            </a-button>
            <a-button block type="dashed" @click="() => console.log('导入缓存')">
              <template #icon><import-outlined /></template>
              导入缓存数据
            </a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.cache-management {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>