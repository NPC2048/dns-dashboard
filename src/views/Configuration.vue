<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  UndoOutlined,
  ExportOutlined,
  ImportOutlined,
  PoweroffOutlined,
  WifiOutlined
} from '@ant-design/icons-vue'
import { getDnsConfig, updateDnsConfig, testUpstreamDns } from '@/api/dns'

const router = useRouter()

// 配置表单
const configForm = reactive({
  // 上游 DNS 配置
  upstreamDns: [
    { address: '8.8.8.8', port: 53, timeout: 5000, useProxy: false, enabled: true, priority: 1 },
    { address: '8.8.4.4', port: 53, timeout: 5000, useProxy: false, enabled: true, priority: 2 },
    { address: '114.114.114.114', port: 53, timeout: 5000, useProxy: false, enabled: true, priority: 3 }
  ] as Array<{
    address: string
    port?: number
    timeout?: number
    useProxy?: boolean
    proxyConfig?: {
      host: string
      port?: number
      type?: string
      username?: string
      password?: string
    }
    enabled?: boolean
    priority?: number
  }>,
  defaultTimeout: 5000,
  retryCount: 3,

  // 缓存配置
  cacheEnabled: true,
  cacheMaxSize: 10000,
  cacheDefaultTtl: 300,

  // 网络配置
  listenPort: 5354,

  // 日志配置
  queryLogEnabled: true,
})

// 新增上游 DNS
const newUpstreamDns = ref('')
const newUpstreamPort = ref(53)
const newUpstreamTimeout = ref(5000)
const newUpstreamUseProxy = ref(false)

const addUpstreamDns = () => {
  if (newUpstreamDns.value) {
    const exists = configForm.upstreamDns.some(dns => dns.address === newUpstreamDns.value)
    if (!exists) {
      configForm.upstreamDns.push({
        address: newUpstreamDns.value,
        port: newUpstreamPort.value,
        timeout: newUpstreamTimeout.value,
        useProxy: newUpstreamUseProxy.value,
        enabled: true,
        priority: configForm.upstreamDns.length + 1
      })
      newUpstreamDns.value = ''
      newUpstreamPort.value = 53
      newUpstreamTimeout.value = 5000
      newUpstreamUseProxy.value = false
    } else {
      message.warning('该 DNS 服务器已存在')
    }
  }
}

const removeUpstreamDns = (index: number) => {
  configForm.upstreamDns.splice(index, 1)
}

// 编辑上游 DNS 的代理配置
const editingProxyIndex = ref<number | null>(null)
const proxyConfigForm = reactive({
  host: '',
  port: 8080,
  type: 'HTTP',
  username: '',
  password: ''
})

const editProxyConfig = (index: number) => {
  editingProxyIndex.value = index
  const dns = configForm.upstreamDns[index]
  if (dns.proxyConfig) {
    proxyConfigForm.host = dns.proxyConfig.host || ''
    proxyConfigForm.port = dns.proxyConfig.port || 8080
    proxyConfigForm.type = dns.proxyConfig.type || 'HTTP'
    proxyConfigForm.username = dns.proxyConfig.username || ''
    proxyConfigForm.password = dns.proxyConfig.password || ''
  } else {
    proxyConfigForm.host = ''
    proxyConfigForm.port = 8080
    proxyConfigForm.type = 'HTTP'
    proxyConfigForm.username = ''
    proxyConfigForm.password = ''
  }
}

const saveProxyConfig = () => {
  if (editingProxyIndex.value !== null) {
    configForm.upstreamDns[editingProxyIndex.value].proxyConfig = {
      host: proxyConfigForm.host,
      port: proxyConfigForm.port,
      type: proxyConfigForm.type,
      username: proxyConfigForm.username,
      password: proxyConfigForm.password
    }
    editingProxyIndex.value = null
    message.success('代理配置已保存')
  }
}

const cancelProxyConfig = () => {
  editingProxyIndex.value = null
}

// 表单提交
const loading = ref(false)

// 加载配置
onMounted(async () => {
  try {
    loading.value = true
    const config = await getDnsConfig()
    Object.assign(configForm, config)
    message.success('配置加载成功')
  } catch (error) {
    console.error('加载配置失败:', error)
    message.error('加载配置失败，使用默认配置')
  } finally {
    loading.value = false
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true
    await updateDnsConfig(configForm)
    message.success('配置保存成功！')
  } catch (error) {
    console.error('保存配置失败:', error)
    message.error('保存配置失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  // 重置为默认值
  Object.assign(configForm, {
    upstreamDns: [
      { address: '8.8.8.8', port: 53, timeout: 5000, useProxy: false, enabled: true, priority: 1 },
      { address: '8.8.4.4', port: 53, timeout: 5000, useProxy: false, enabled: true, priority: 2 },
      { address: '114.114.114.114', port: 53, timeout: 5000, useProxy: false, enabled: true, priority: 3 }
    ],
    defaultTimeout: 5000,
    retryCount: 3,
    cacheEnabled: true,
    cacheMaxSize: 10000,
    cacheDefaultTtl: 300,
    listenPort: 5354,
    queryLogEnabled: true,
  })
  message.info('配置已重置为默认值')
}

const handleTestConnection = async () => {
  const hide = message.loading('测试上游 DNS 连接中...', 0)

  try {
    // 测试第一个上游 DNS
    const firstDns = configForm.upstreamDns[0]
    if (!firstDns) {
      throw new Error('没有配置上游 DNS')
    }

    const result = await testUpstreamDns({
      domain: 'google.com',
      address: firstDns.address,
      port: firstDns.port,
      useProxy: firstDns.useProxy
    })

    hide()
    if (result.success) {
      message.success('上游 DNS 连接测试通过！')
    } else {
      message.warning('上游 DNS 连接测试失败')
    }
  } catch (error) {
    hide()
    console.error('测试连接失败:', error)
    message.error('测试连接失败')
  }
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
                <a-table
                  :data-source="configForm.upstreamDns"
                  :pagination="false"
                  size="small"
                  style="width: 100%"
                >
                  <a-table-column title="地址" data-index="address" key="address" />
                  <a-table-column title="端口" data-index="port" key="port">
                    <template #default="{ record }">
                      {{ record.port || 53 }}
                    </template>
                  </a-table-column>
                  <a-table-column title="超时" data-index="timeout" key="timeout">
                    <template #default="{ record }">
                      {{ record.timeout || 5000 }}ms
                    </template>
                  </a-table-column>
                  <a-table-column title="代理" data-index="useProxy" key="useProxy">
                    <template #default="{ record }">
                      <a-tag :color="record.useProxy ? 'blue' : 'default'">
                        {{ record.useProxy ? '使用代理' : '直连' }}
                      </a-tag>
                    </template>
                  </a-table-column>
                  <a-table-column title="状态" data-index="enabled" key="enabled">
                    <template #default="{ record }">
                      <a-tag :color="record.enabled ? 'green' : 'red'">
                        {{ record.enabled ? '启用' : '禁用' }}
                      </a-tag>
                    </template>
                  </a-table-column>
                  <a-table-column title="操作" key="action">
                    <template #default="{ index }">
                      <a-space>
                        <a-button
                          type="link"
                          size="small"
                          @click="editProxyConfig(index)"
                          v-if="configForm.upstreamDns[index].useProxy"
                        >
                          代理配置
                        </a-button>
                        <a-button
                          type="link"
                          danger
                          size="small"
                          @click="removeUpstreamDns(index)"
                        >
                          删除
                        </a-button>
                      </a-space>
                    </template>
                  </a-table-column>
                </a-table>

                <a-card title="添加上游 DNS" size="small" style="margin-top: 16px">
                  <a-space>
                    <a-input
                      v-model:value="newUpstreamDns"
                      placeholder="DNS 服务器地址"
                      style="width: 150px"
                    />
                    <a-input-number
                      v-model:value="newUpstreamPort"
                      placeholder="端口"
                      :min="1"
                      :max="65535"
                      style="width: 100px"
                    />
                    <a-input-number
                      v-model:value="newUpstreamTimeout"
                      placeholder="超时"
                      :min="1000"
                      :max="30000"
                      :step="1000"
                      style="width: 120px"
                      addon-after="ms"
                    />
                    <a-checkbox v-model:checked="newUpstreamUseProxy">
                      使用代理
                    </a-checkbox>
                    <a-button @click="addUpstreamDns" type="primary">
                      添加
                    </a-button>
                  </a-space>
                </a-card>
              </a-space>
            </a-form-item>

            <a-form-item label="DNS 查询超时">
              <a-input-number
                v-model:value="configForm.defaultTimeout"
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
                v-model:value="configForm.cacheMaxSize"
                :min="1000"
                :max="100000"
                :step="1000"
                addon-after="条"
              />
            </a-form-item>

            <a-form-item label="默认 TTL">
              <a-input-number
                v-model:value="configForm.cacheDefaultTtl"
                :min="60"
                :max="86400"
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
            <a-form-item label="启用查询日志">
              <a-switch v-model:checked="configForm.queryLogEnabled" />
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

    <!-- 代理配置模态框 -->
    <a-modal
      :open="editingProxyIndex !== null"
      title="代理配置"
      @ok="saveProxyConfig"
      @cancel="cancelProxyConfig"
    >
      <a-form
        :model="proxyConfigForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="代理主机">
          <a-input v-model:value="proxyConfigForm.host" placeholder="例如: proxy.example.com" />
        </a-form-item>
        <a-form-item label="代理端口">
          <a-input-number
            v-model:value="proxyConfigForm.port"
            :min="1"
            :max="65535"
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item label="代理类型">
          <a-select v-model:value="proxyConfigForm.type">
            <a-select-option value="HTTP">HTTP 代理</a-select-option>
            <a-select-option value="SOCKS5">SOCKS5 代理</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="用户名">
          <a-input v-model:value="proxyConfigForm.username" placeholder="可选" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model:value="proxyConfigForm.password" placeholder="可选" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.configuration {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>