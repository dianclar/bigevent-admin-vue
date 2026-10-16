<script setup>
import { getClassList } from '@/api/document'
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { addClass, setClass, delClass } from '@/api/document.js'

// 获取分类列表
const request = ref(true)
const cllassList = ref()
getClassList().then(res => {
  cllassList.value = res.data.data
  request.value = false
})

// 弹出组件
const popup = ref()
const popupTitle = ref()

// 添加/编辑分类
const setData = data => {
  popupTitle.value = data ? '编辑分类' : '添加分类'
  popup.value.open({
    ...data,
    init: {
      cate_name: {
        label: '分类名称',
        placeholder: '请输入分类名称',
        rules: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
      },
      cate_alias: {
        label: '分类别名',
        placeholder: '请输入分类别名',
        rules: [{ required: true, message: '请输入分类别名', trigger: 'blur' }],
      },
    },
  })
}

// 提交添加/编辑分类
const commit = async data => {
  if (data.id) {
    const res = await setClass(data)
    ElMessage.success(res.data.message)
  } else {
    const res = await addClass(data)
    ElMessage.success(res.data.message)
  }
  request.value = true
  const res = await getClassList()
  cllassList.value = res.data.data
  request.value = false
}

// 删除分类
const del = row => {
  ElMessageBox.confirm(`确定要删除【${row.cate_name}】分类吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const res = await delClass({ id: row.id })
    ElMessage.success(res.data.message)
    request.value = true
    const d = await getClassList()
    cllassList.value = d.data.data
    request.value = false
  })
}
</script>

<template>
  <mainPage title="文章分类">
    <!-- 标题栏 -->
    <template #header>
      <el-button
        type="primary"
        @click="setData(null)"
        >添加分类</el-button
      >
    </template>

    <!-- 表格 -->
    <el-table
      :data="cllassList"
      style="width: 100%"
      v-loading="request"
    >
      <el-table-column
        label="序号"
        type="index"
        width="80"
      ></el-table-column>
      <el-table-column
        label="分类名称"
        prop="cate_name"
      ></el-table-column>
      <el-table-column
        label="分类别名"
        prop="cate_alias"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="180"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            size="small"
            :icon="Edit"
            @click="setData(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="del(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>

      <template #empty>
        <el-empty></el-empty>
      </template>
    </el-table>
  </mainPage>

  <PopupPage
    ref="popup"
    :title="popupTitle"
    @commit="commit($event)"
  ></PopupPage>
</template>

<style></style>
