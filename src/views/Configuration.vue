<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 配置表单
const configForm = reactive({
  // 上游 DNS 配置
  upstreamDns: ['8.8.8.8', '8.8.4.4', '114.114.114.114'],
  dnsTimeout: 5000,
  retryCount: 3,

  // 缓存配置
  cacheEnabled: true,
  cacheSize: 10000,
  defaultTtl: 3600,
  cacheCleanInterval: 300,

  // 网络配置
  listenPort: 53,
  listenAddress: '0.0.0.0',
  maxConnections: 1000,

  // 日志配置
  logLevel: 'INFO',
  logToFile: true,
  logFilePath: './logs/dns-server.log',
  logMaxSize: 100,

  // 安全配置
  enableRateLimit: true,
  maxQueriesPerSecond: 100,
  blacklistEnabled: false,
  whitelistEnabled: false,
})

// 新增上游 DNS
const newUpstreamDns = ref('')

const addUpstreamDns = () => {
  if (newUpstreamDns.value && !configForm.upstreamDns.includes(newUpstreamDns.value)) {
    configForm.upstreamDns.push(newUpstreamDns.value)
    newUpstreamDns.value = ''
  }
}

const removeUpstreamDns = (index: number) => {
  configForm.upstreamDns.splice(index, 1)
}

// 表单提交
const loading = ref(false)

const handleSubmit = () => {
  loading.value = true
  // 模拟保存配置
  setTimeout(() => {
    loading.value = false
    message.success('配置保存成功！')
  }, 1000)
}

const handleReset = () => {
  // 重置为默认值
  Object.assign(configForm, {
    upstreamDns: ['8.8.8.8', '8.8.4.4', '114.114.114.114'],
    dnsTimeout: 5000,
    retryCount: 3,
    cacheEnabled: true,
    cacheSize: 10000,
    defaultTtl: 3600,
    cacheCleanInterval: 300,
    listenPort: 53,
    listenAddress: '0.0.0.0',
    maxConnections: 1000,
    logLevel: 'INFO',
    logToFile: true,
    logFilePath: './logs/dns-server.log',
    logMaxSize: 100,
    enableRateLimit: true,
    maxQueriesPerSecond: 100,
    blacklistEnabled: false,
    whitelistEnabled: false,
  })
  message.info('配置已重置为默认值')
}

const handleTestConnection = () => {
  message.loading('测试上游 DNS 连接中...', 2)
    .then(() => message.success('所有上游 DNS 连接测试通过！'))
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="configuration">
    <a-page-header
      title="系统配置"
      sub-title="DNS 服务器配置管理"
      @back="() => router.push('/')"
    >
      <template #extra>
        <a-space>
          <a-button @click="navigateTo('/dashboard')">返回仪表盘</a-button>
          <a-button @click="navigateTo('/cache')">缓存管理</a-button>
          <a-button type="primary" @click="handleSubmit" :loading="loading">
            保存配置
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-tabs type="card" style="margin-top: 24px">
      <a-tab-pane key="1" tab="上游 DNS 配置">
        <a-card>
          <a-form
            :model="configForm"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            style="max-width: 800px"
          >
            <a-form-item label="上游 DNS 服务器">
              <a-space direction="vertical" style="width: 100%">
                <a-space v-for="(dns, index) in configForm.upstreamDns" :key="index">
                  <a-input :value="dns" disabled style="width: 200px" />
                  <a-button
                    type="link"
                    danger
                    @click="removeUpstreamDns(index)"
                  >
                    删除
                  </a-button>
                </a-space>
                <a-space>
                  <a-input
                    v-model:value="newUpstreamDns"
                    placeholder="输入新的上游 DNS 服务器 IP"
                    style="width: 200px"
                    @press-enter="addUpstreamDns"
                  />
                  <a-button @click="addUpstreamDns">添加</a-button>
                </a-space>
              </a-space>
            </a-form-item>

            <a-form-item label="DNS 查询超时">
              <a-input-number
                v-model:value="configForm.dnsTimeout"
                :min="1000"
                :max="30000"
                :step="1000"
                addon-after="毫秒"
              />
            </a-form-item>

            <a-form-item label="重试次数">
              <a-input-number
                v-model:value="configForm.retryCount"
                :min="1"
                :max="5"
              />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
              <a-button @click="handleTestConnection" type="dashed">
                <template #icon><wifi-outlined /></template>
                测试上游 DNS 连接
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="2" tab="缓存配置">
        <a-card>
          <a-form
            :model="configForm"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            style="max-width: 800px"
          >
            <a-form-item label="启用缓存">
              <a-switch v-model:checked="configForm.cacheEnabled" />
            </a-form-item>

            <a-form-item label="缓存大小限制">
              <a-input-number
                v-model:value="configForm.cacheSize"
                :min="1000"
                :max="100000"
                :step="1000"
                addon-after="条"
              />
            </a-form-item>

            <a-form-item label="默认 TTL">
              <a-input-number
                v-model:value="configForm.defaultTtl"
                :min="60"
                :max="86400"
                :step="60"
                addon-after="秒"
              />
            </a-form-item>

            <a-form-item label="缓存清理间隔">
              <a-input-number
                v-model:value="configForm.cacheCleanInterval"
                :min="60"
                :max="3600"
                :step="60"
                addon-after="秒"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="3" tab="网络配置">
        <a-card>
          <a-form
            :model="configForm"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            style="max-width: 800px"
          >
            <a-form-item label="监听端口">
              <a-input-number
                v-model:value="configForm.listenPort"
                :min="1"
                :max="65535"
              />
            </a-form-item>

            <a-form-item label="监听地址">
              <a-input v-model:value="configForm.listenAddress" />
            </a-form-item>

            <a-form-item label="最大连接数">
              <a-input-number
                v-model:value="configForm.maxConnections"
                :min="100"
                :max="10000"
                :step="100"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="4" tab="日志配置">
        <a-card>
          <a-form
            :model="configForm"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            style="max-width: 800px"
          >
            <a-form-item label="日志级别">
              <a-select v-model:value="configForm.logLevel">
                <a-select-option value="DEBUG">DEBUG</a-select-option>
                <a-select-option value="INFO">INFO</a-select-option>
                <a-select-option value="WARN">WARN</a-select-option>
                <a-select-option value="ERROR">ERROR</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="输出到文件">
              <a-switch v-model:checked="configForm.logToFile" />
            </a-form-item>

            <a-form-item label="日志文件路径">
              <a-input v-model:value="configForm.logFilePath" />
            </a-form-item>

            <a-form-item label="日志文件最大大小">
              <a-input-number
                v-model:value="configForm.logMaxSize"
                :min="10"
                :max="1000"
                :step="10"
                addon-after="MB"
              />
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>

      <a-tab-pane key="5" tab="安全配置">
        <a-card>
          <a-form
            :model="configForm"
            :label-col="{ span: 8 }"
            :wrapper-col="{ span: 16 }"
            style="max-width: 800px"
          >
            <a-form-item label="启用速率限制">
              <a-switch v-model:checked="configForm.enableRateLimit" />
            </a-form-item>

            <a-form-item label="最大 QPS">
              <a-input-number
                v-model:value="configForm.maxQueriesPerSecond"
                :min="10"
                :max="1000"
                :step="10"
                addon-after="次/秒"
              />
            </a-form-item>

            <a-form-item label="启用黑名单">
              <a-switch v-model:checked="configForm.blacklistEnabled" />
            </a-form-item>

            <a-form-item label="启用白名单">
              <a-switch v-model:checked="configForm.whitelistEnabled" />
            </a-form-item>
          </a-form>
        </a-card>
      </a-tab-pane>
    </a-tabs>

    <a-card style="margin-top: 24px">
      <template #title>
        <a-space>
          <span>配置操作</span>
          <a-tag color="orange">修改后需要重启服务生效</a-tag>
        </a-space>
      </template>

      <a-space>
        <a-button type="primary" @click="handleSubmit" :loading="loading">
          <template #icon><save-outlined /></template>
          保存配置
        </a-button>
        <a-button @click="handleReset">
          <template #icon><undo-outlined /></template>
          重置为默认值
        </a-button>
        <a-button type="dashed" @click="() => console.log('导出配置')">
          <template #icon><export-outlined /></template>
          导出配置
        </a-button>
        <a-button type="dashed" @click="() => console.log('导入配置')">
          <template #icon><import-outlined /></template>
          导入配置
        </a-button>
        <a-button type="primary" danger @click="() => console.log('重启服务')">
          <template #icon><poweroff-outlined /></template>
          重启 DNS 服务
        </a-button>
      </a-space>

      <a-alert
        message="配置说明"
        description="部分配置修改后需要重启 DNS 服务器才能生效。建议在业务低峰期进行配置变更。"
        type="info"
        show-icon
        style="margin-top: 16px"
      />
    </a-card>
  </div>
</template>

<style scoped>
.configuration {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>