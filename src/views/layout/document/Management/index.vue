<script setup>
import { ref } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { getClassList, getDocumentList } from '@/api/document.js'
import { formatTime } from '@/utils/format.js'
import drawerPage from './components/drawerPage.vue'
import { addDocument, setDocument, delDocument } from '@/api/document.js'

// 是否请求中
const requesting = ref(true)

// 获取文章分类列表
const classList = ref([])
getClassList().then(res => {
  classList.value = res.data.data
})

// 获取文章列表
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: '',
})
const documentList = ref([])
const documentnum = ref(0)
const reqdoclist = () => {
  requesting.value = true
  getDocumentList(params.value).then(res => {
    documentList.value = res.data.data
    documentnum.value = res.data.total
    documentList.value.forEach(item => {
      item.pub_date = formatTime(item.pub_date)
    })
    requesting.value = false
  })
}
reqdoclist()

// 搜索
const search = () => {
  params.value.pagenum = 1
  reqdoclist()
}
// 重置
const reset = () => {
  params.value.cate_id = ''
  params.value.state = ''
  params.value.pagenum = 1
  reqdoclist()
}

// 分页大小
const sizeChange = size => {
  params.value.pagenum = 1
  params.value.pagesize = size
  reqdoclist()
}
// 页码改变
const currentChange = page => {
  params.value.pagenum = page
  reqdoclist()
}

// 抽屉组件
const drawerShow = ref(false)
const drawerTitle = ref('')
const drawerRef = ref()

// 添加/编辑文章
const setData = data => {
  drawerTitle.value = data ? '编辑文章' : '添加文章'
  drawerRef.value.open({
    ...data,
    classList: classList.value,
  })
}

// 提交文章
const commit = async data => {
  const fd = new FormData()
  for (const key in data) {
    fd.append(key, data[key])
  }
  if (data.id) {
    const res = await setDocument(fd)
    ElMessage.success(res.data.message)
  } else {
    params.value.pagenum = Math.ceil((documentnum.value + 1) / params.value.pagesize)
    const res = await addDocument(fd)
    ElMessage.success(res.data.message)
  }
  reqdoclist()
}

// 删除文章
const deldoc = async row => {
  const res = await delDocument(row)
  reqdoclist()
  ElMessage.success(res.data.message)
}
</script>

<template>
  <mainPage title="文章管理">
    <!-- 标题栏 -->
    <template #header>
      <el-button
        type="primary"
        @click="setData(null)"
        >添加管理</el-button
      >
    </template>

    <!-- 搜索 -->
    <el-form inline>
      <!-- 分类搜索 -->
      <el-form-item label="文章分类">
        <el-select
          v-model="params.cate_id"
          style="width: 180px"
        >
          <el-option
            :label="i.cate_name"
            :value="i.id"
            v-for="i in classList"
            :key="i.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <!-- 状态搜索 -->
      <el-form-item label="文章状态">
        <el-select
          v-model="params.state"
          style="width: 180px"
        >
          <el-option
            label="已发布"
            value="已发布"
          ></el-option>
          <el-option
            label="草稿"
            value="草稿"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="search"
          >搜索</el-button
        >
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table
      style="width: 100%"
      :data="documentList"
      v-loading="requesting"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
      ></el-table-column>
      <el-table-column label="文章标题">
        <template #default="{ row }">
          <el-link :underline="false">{{ row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="cate_name"
        label="分类"
      ></el-table-column>
      <el-table-column
        prop="state"
        label="状态"
      ></el-table-column>
      <el-table-column
        prop="pub_date"
        label="创建时间"
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
            @click="deldoc(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 20px; justify-content: end"
      background
      layout="sizes, prev, pager, next, jumper, total"
      :total="documentnum"
      :page-sizes="[5, 10, 20]"
      v-model:page-size="params.pagesize"
      v-model:current-page="params.pagenum"
      @size-change="sizeChange"
      @current-change="currentChange"
    />

    <!-- 抽屉 -->
    <drawerPage
      :show="drawerShow"
      :title="drawerTitle"
      ref="drawerRef"
      @commit="commit($event)"
    >
    </drawerPage>
  </mainPage>
</template>
