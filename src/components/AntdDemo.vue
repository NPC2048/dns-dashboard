<script setup lang="ts">
import { ref, reactive } from 'vue'
import { notification, message } from 'ant-design-vue'
import type { TableColumnsType } from 'ant-design-vue'

// 表单数据
const formState = reactive({
  username: '',
  password: '',
  remember: true,
})

// 表格数据
interface DataItem {
  key: string
  name: string
  age: number
  address: string
}

const dataSource = ref<DataItem[]>([
  {
    key: '1',
    name: '张三',
    age: 32,
    address: '北京市朝阳区',
  },
  {
    key: '2',
    name: '李四',
    age: 42,
    address: '上海市浦东新区',
  },
  {
    key: '3',
    name: '王五',
    age: 28,
    address: '深圳市南山区',
  },
])

const columns: TableColumnsType = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
  },
]

// 模态框状态
const modalVisible = ref(false)

// 通知
const openNotification = () => {
  notification.success({
    message: '操作成功',
    description: '这是一个成功的通知消息。',
  })
}

// 消息
const showMessage = () => {
  message.success('这是一个成功的消息提示！')
}

// 步骤条当前步骤
const currentStep = ref(0)

// 标签页当前标签
const activeTabKey = ref('1')

// 进度条百分比
const percent = ref(0)

// 模拟进度
const startProgress = () => {
  percent.value = 0
  const timer = setInterval(() => {
    percent.value += 10
    if (percent.value >= 100) {
      clearInterval(timer)
      message.success('进度完成！')
    }
  }, 300)
}
</script>

<template>
  <div class="antd-demo">
    <a-typography-title :level="2">Ant Design Vue Demo</a-typography-title>
    <a-typography-paragraph>
      这是一个展示 Ant Design Vue 常用组件的示例页面。
    </a-typography-paragraph>

    <a-divider>布局组件</a-divider>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-card title="卡片组件" style="margin-bottom: 16px">
          <p>这是一个卡片组件，可以包含任何内容。</p>
          <p>卡片通常用于展示相关内容。</p>
          <template #extra>
            <a-button type="link">更多</a-button>
          </template>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="统计卡片" style="margin-bottom: 16px">
          <a-statistic title="活跃用户" :value="112893" style="margin-right: 50px" />
          <a-statistic title="查询总数" :value="932" :precision="2">
            <template #suffix>
              <span>次</span>
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <a-divider>表单组件</a-divider>

    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      style="max-width: 600px; margin: 0 auto"
    >
      <a-form-item
        label="用户名"
        name="username"
        :rules="[{ required: true, message: '请输入用户名!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="密码"
        name="password"
        :rules="[{ required: true, message: '请输入密码!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <a-checkbox v-model:checked="formState.remember">记住我</a-checkbox>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">提交</a-button>
        <a-button style="margin-left: 10px">重置</a-button>
      </a-form-item>
    </a-form>

    <a-divider>数据展示</a-divider>

    <a-table :data-source="dataSource" :columns="columns" style="margin-bottom: 24px" />

    <a-tabs v-model:activeKey="activeTabKey">
      <a-tab-pane key="1" tab="标签一">
        <p>标签一的内容</p>
      </a-tab-pane>
      <a-tab-pane key="2" tab="标签二" force-render>
        <p>标签二的内容</p>
      </a-tab-pane>
      <a-tab-pane key="3" tab="标签三">
        <p>标签三的内容</p>
      </a-tab-pane>
    </a-tabs>

    <a-divider>交互组件</a-divider>

    <div style="margin-bottom: 24px">
      <a-space>
        <a-button type="primary" @click="modalVisible = true">打开模态框</a-button>
        <a-button type="primary" @click="openNotification">显示通知</a-button>
        <a-button type="primary" @click="showMessage">显示消息</a-button>
        <a-button type="primary" @click="startProgress">开始进度</a-button>
      </a-space>
    </div>

    <a-progress :percent="percent" style="margin-bottom: 24px" />

    <a-steps :current="currentStep" style="margin-bottom: 24px">
      <a-step title="第一步" description="这是第一步的描述" />
      <a-step title="第二步" description="这是第二步的描述" />
      <a-step title="第三步" description="这是第三步的描述" />
    </a-steps>

    <a-space>
      <a-button @click="currentStep > 0 ? currentStep-- : null">上一步</a-button>
      <a-button type="primary" @click="currentStep < 2 ? currentStep++ : null">下一步</a-button>
    </a-space>

    <a-modal v-model:open="modalVisible" title="模态框标题" @ok="modalVisible = false">
      <p>这是一个模态框的内容。</p>
      <p>可以在这里放置表单或其他内容。</p>
    </a-modal>
  </div>
</template>

<style scoped>
.antd-demo {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>