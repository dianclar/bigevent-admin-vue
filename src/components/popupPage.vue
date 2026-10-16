<script setup>
import { ref } from 'vue'

// 表单数据
const propsData = ref()
const show = ref(false)
const rules = ref({})
const popupRef = ref()

// 打开弹出框
const open = data => {
  propsData.value = data
  for (const key in data.init) {
    rules.value[key] = data.init[key].rules
  }
  show.value = true
}

// 提交表单
const emit = defineEmits(['commit'])
const commit = async () => {
  await popupRef.value.validate()
  emit('commit', propsData.value)
  show.value = false
}

defineExpose({
  open,
})

defineProps({
  title: {
    type: String,
    required: false,
  },
})
</script>

<template>
  <el-dialog
    :title="title"
    v-model="show"
  >
    <el-form
      style="margin: 20px"
      :model="propsData"
      :rules="rules"
      ref="popupRef"
    >
      <el-form-item
        v-for="(V, K) in propsData.init"
        :key="K"
        :label="V.label"
        :prop="K"
      >
        <el-input
          :placeholder="V.placeholder"
          v-model="propsData[K]"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取 消</el-button>
        <el-button
          type="primary"
          @click="commit"
          >确 定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
