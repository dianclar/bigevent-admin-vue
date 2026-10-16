import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/layout/document/Management/index.vue'),
        },
        {
          path: '/class',
          component: () => import('@/views/layout/document/class/index.vue'),
        },
        {
          path: '/user',
          component: () => import('@/views/layout/user/info/index.vue'),
        },
        {
          path: '/setuser',
          component: () => import('@/views/layout/user/setuser/index.vue'),
        },
      ],
    },
  ],
})

// 登陆校验
router.beforeEach(to => {
  if (to.path !== '/login' && !useUserStore().token) {
    ElMessage.warning('登录过期，请重新登录')
    return '/login'
  }
})

export default router
