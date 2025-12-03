<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟统计数据
const statistics = ref({
  totalQueries: 12543,
  cacheHits: 10234,
  cacheMisses: 2309,
  cacheHitRate: 81.6,
  qps: 156,
  memoryUsage: 245,
  topDomains: [
    { domain: 'google.com', count: 1234 },
    { domain: 'github.com', count: 987 },
    { domain: 'stackoverflow.com', count: 765 },
    { domain: 'npmjs.com', count: 543 },
    { domain: 'vuejs.org', count: 432 },
  ],
  queryTypes: {
    A: 8567,
    AAAA: 2345,
    CNAME: 987,
    MX: 543,
    TXT: 321,
    OTHER: 780,
  }
})

// 模拟实时数据更新
let timer: number | null = null

const updateStatistics = () => {
  statistics.value = {
    totalQueries: statistics.value.totalQueries + Math.floor(Math.random() * 100),
    cacheHits: statistics.value.cacheHits + Math.floor(Math.random() * 80),
    cacheMisses: statistics.value.cacheMisses + Math.floor(Math.random() * 20),
    cacheHitRate: Math.random() > 0.5 ?
      statistics.value.cacheHitRate + 0.1 :
      statistics.value.cacheHitRate - 0.1,
    qps: Math.floor(Math.random() * 200),
    memoryUsage: statistics.value.memoryUsage + Math.floor(Math.random() * 10 - 5),
    topDomains: statistics.value.topDomains.map(item => ({
      ...item,
      count: item.count + Math.floor(Math.random() * 10)
    })),
    queryTypes: {
      A: statistics.value.queryTypes.A + Math.floor(Math.random() * 50),
      AAAA: statistics.value.queryTypes.AAAA + Math.floor(Math.random() * 20),
      CNAME: statistics.value.queryTypes.CNAME + Math.floor(Math.random() * 10),
      MX: statistics.value.queryTypes.MX + Math.floor(Math.random() * 5),
      TXT: statistics.value.queryTypes.TXT + Math.floor(Math.random() * 3),
      OTHER: statistics.value.queryTypes.OTHER + Math.floor(Math.random() * 15),
    }
  }
}

onMounted(() => {
  // 每3秒更新一次数据
  timer = setInterval(updateStatistics, 3000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="dashboard">
    <a-page-header
      title="仪表盘"
      sub-title="DNS 服务器实时统计"
      @back="() => router.push('/')"
    >
      <template #extra>
        <a-space>
          <a-button @click="navigateTo('/cache')">缓存管理</a-button>
          <a-button @click="navigateTo('/config')" type="primary">系统配置</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="16" style="margin-top: 24px; margin-bottom: 24px">
      <a-col :span="6">
        <a-card>
          <a-statistic
            title="总查询数"
            :value="statistics.totalQueries"
            :precision="0"
            style="margin-right: 50px"
          >
            <template #suffix>
              <arrow-up-outlined style="color: #3f8600" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card>
          <a-statistic
            title="缓存命中率"
            :value="statistics.cacheHitRate"
            :precision="1"
            suffix="%"
            :value-style="{ color: statistics.cacheHitRate > 80 ? '#3f8600' : '#cf1322' }"
          >
            <template #prefix>
              <database-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card>
          <a-statistic
            title="当前 QPS"
            :value="statistics.qps"
            :precision="0"
            suffix="次/秒"
          >
            <template #prefix>
              <rocket-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>

      <a-col :span="6">
        <a-card>
          <a-statistic
            title="内存使用"
            :value="statistics.memoryUsage"
            :precision="0"
            suffix="MB"
          >
            <template #prefix>
              <memory-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16" style="margin-bottom: 24px">
      <a-col :span="12">
        <a-card title="查询类型分布">
          <a-descriptions :column="2" bordered>
            <a-descriptions-item label="A 记录">
              {{ statistics.queryTypes.A }}
            </a-descriptions-item>
            <a-descriptions-item label="AAAA 记录">
              {{ statistics.queryTypes.AAAA }}
            </a-descriptions-item>
            <a-descriptions-item label="CNAME 记录">
              {{ statistics.queryTypes.CNAME }}
            </a-descriptions-item>
            <a-descriptions-item label="MX 记录">
              {{ statistics.queryTypes.MX }}
            </a-descriptions-item>
            <a-descriptions-item label="TXT 记录">
              {{ statistics.queryTypes.TXT }}
            </a-descriptions-item>
            <a-descriptions-item label="其他类型">
              {{ statistics.queryTypes.OTHER }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <a-col :span="12">
        <a-card title="Top 5 查询域名">
          <a-list :data-source="statistics.topDomains" size="small">
            <template #renderItem="{ item, index }">
              <a-list-item>
                <a-list-item-meta>
                  <template #title>
                    <a-tag color="blue">{{ index + 1 }}</a-tag>
                    {{ item.domain }}
                  </template>
                  <template #description>
                    查询次数: {{ item.count }}
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="24">
        <a-card title="缓存命中/未命中统计">
          <a-row>
            <a-col :span="12" style="text-align: center">
              <a-progress
                type="dashboard"
                :percent="statistics.cacheHitRate"
                :stroke-color="{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }"
              />
              <div style="margin-top: 8px">缓存命中率</div>
            </a-col>
            <a-col :span="12">
              <a-statistic
                title="缓存命中"
                :value="statistics.cacheHits"
                style="margin-bottom: 16px"
              />
              <a-statistic
                title="缓存未命中"
                :value="statistics.cacheMisses"
                :value-style="{ color: '#cf1322' }"
              />
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>