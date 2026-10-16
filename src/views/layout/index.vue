<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  SwitchButton,
  CaretBottom,
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { getUserInfo } from '@/api/user'
import { useUserStore } from '@/stores'
import router from '@/router'

// 获取用户信息
getUserInfo().then(res => {
  useUserStore().setUserInfo(res.data.data)
})

// 头像下拉菜单处理
const command = async command => {
  if (command === 'logout') {
    await ElMessageBox.confirm('你真的要退出登录了吗？', '温馨提示', {
      confirmButtonText: '真的',
      cancelButtonText: '不了',
      type: 'warning',
    })
    useUserStore().setToken('').setUserInfo()
    router.push('/login')
    ElMessage.success('退出登录成功')
  } else {
    router.push(`/${command}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#409EFF"
        background-color="rgba(0, 0, 0, 0)"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/home">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-menu-item index="/class">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-sub-menu>
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="user">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="setuser">
            <el-icon><User /></el-icon>
            <span>用户设置</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>
          黑马程序员：<strong>{{
            useUserStore().userInfo.nickname || useUserStore().userInfo.username
          }}</strong>
        </div>
        <el-dropdown
          placement="bottom-end"
          @command="command"
        >
          <span class="el-dropdown__box">
            <el-avatar :src="useUserStore().userInfo.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <!-- 选项 -->
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                command="user"
                :icon="User"
                >基本资料</el-dropdown-item
              >
              <el-dropdown-item
                command="setuser"
                :icon="Crop"
                >用户设置</el-dropdown-item
              >
              <el-dropdown-item
                command="logout"
                :icon="SwitchButton"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>大事件 by 黑马程序员</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/logo.png') no-repeat center / 120px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
    height: fit-content;
  }
}
</style>
