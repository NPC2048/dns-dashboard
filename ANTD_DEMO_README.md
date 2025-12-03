# Ant Design Vue Demo 页面使用说明

## 概述

这是一个展示 Ant Design Vue 4.x 常用组件的示例页面，包含了布局、表单、数据展示、交互等各类组件。

## 访问地址

开发服务器启动后，访问：http://localhost:5173

## 包含的组件

### 1. 布局组件
- **Typography** (标题和段落)
- **Grid** (栅格布局 - Row/Col)
- **Card** (卡片)
- **Divider** (分割线)
- **Statistic** (统计数值)

### 2. 表单组件
- **Form** (表单)
- **Input** (输入框)
- **InputPassword** (密码输入框)
- **Checkbox** (复选框)
- **Button** (按钮)

### 3. 数据展示组件
- **Table** (表格)
- **Tabs** (标签页)
- **Steps** (步骤条)

### 4. 交互组件
- **Modal** (模态框)
- **Notification** (通知)
- **Message** (消息提示)
- **Progress** (进度条)

## 功能演示

### 表单功能
- 用户名和密码输入验证
- 记住我复选框
- 提交和重置按钮

### 表格功能
- 展示用户数据表格
- 包含姓名、年龄、地址列

### 交互功能
1. **模态框**：点击"打开模态框"按钮
2. **通知**：点击"显示通知"按钮
3. **消息提示**：点击"显示消息"按钮
4. **进度条**：点击"开始进度"按钮
5. **步骤条**：使用"上一步"/"下一步"按钮导航

## 技术实现

### 主要文件
1. `src/main.ts` - 配置 Ant Design Vue
2. `src/components/AntdDemo.vue` - Demo 页面组件
3. `src/App.vue` - 主应用组件
4. `src/style.css` - 全局样式

### 配置说明

#### 1. 安装 Ant Design Vue
已在 `package.json` 中配置：
```json
"dependencies": {
  "ant-design-vue": "~4.2.6"
}
```

#### 2. 全局引入
在 `main.ts` 中：
```typescript
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'

const app = createApp(App)
app.use(Antd)
```

#### 3. 组件使用示例
```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, Modal } from 'ant-design-vue'

const visible = ref(false)
</script>

<template>
  <a-button @click="visible = true">打开</a-button>
  <a-modal v-model:open="visible" title="标题">
    <p>内容</p>
  </a-modal>
</template>
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 样式说明

- 使用了 Ant Design Vue 的 reset.css 重置样式
- 全局样式已调整为浅色背景 (#f5f5f5)
- Demo 页面有最大宽度限制和居中布局

## 扩展建议

### 1. 添加路由
如果需要多个页面，可以配置 Vue Router：
```bash
pnpm add vue-router
```

### 2. 添加状态管理
如果需要状态管理，可以配置 Pinia：
```bash
pnpm add pinia
```

### 3. 添加图标
Ant Design Vue 的图标需要单独安装：
```bash
pnpm add @ant-design/icons-vue
```

### 4. 按需引入
如果担心包体积过大，可以配置按需引入：
```javascript
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
})
```

## 注意事项

1. **版本兼容性**：确保使用的 Ant Design Vue 版本与 Vue 3 兼容
2. **样式冲突**：Ant Design Vue 的样式可能会与其他 CSS 框架冲突
3. **TypeScript**：项目已配置 TypeScript，组件有完整的类型提示
4. **响应式**：栅格系统支持响应式布局

## 故障排除

### 1. 组件不显示
- 检查是否在 `main.ts` 中正确引入了 Ant Design Vue
- 检查组件名称是否正确（Ant Design Vue 4.x 组件以 `a-` 开头）

### 2. 样式问题
- 检查是否引入了 `ant-design-vue/dist/reset.css`
- 检查是否有其他 CSS 覆盖了 Ant Design 的样式

### 3. TypeScript 错误
- 检查是否安装了正确的类型定义
- 检查导入语句是否正确

---

**提示**：这个 Demo 页面展示了 Ant Design Vue 的核心功能，可以作为后续开发 DNS 管理界面的基础模板。