<script setup lang="ts">
import Layout from '@/components/Layout.vue'
import BlankLayout from '@/components/BlankLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <!-- 登录页不使用布局 -->
  <BlankLayout v-if="route.meta?.hideLayout" />

  <!-- 其他页面使用主布局 -->
  <Layout v-else />
</template>

<style scoped>
/* 移除样式，让组件自己处理 */
</style>