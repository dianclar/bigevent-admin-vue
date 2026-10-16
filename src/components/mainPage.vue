<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <el-card
    class="mainPage"
    shadow=""
  >
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div><slot name="header"></slot></div>
      </div>
    </template>

    <slot></slot>
  </el-card>
</template>

<style scoped lang="scss">
.mainPage {
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
}
</style>
