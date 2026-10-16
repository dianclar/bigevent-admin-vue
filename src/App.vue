<script setup>
import cn from 'element-plus/es/locale/lang/zh-cn'
</script>

<template>
  <el-config-provider :locale="cn"><router-view /></el-config-provider>
</template>
