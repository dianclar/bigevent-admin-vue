# bigevent-admin

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

# 说明文档

可以管理文章的后台系统
一个vue3的练手项目，遵循企业规范化开发

# 从0开始

## 安装pnpm

```
# cmd
npm i -g pnpm
```

## 创建项目

```
# cmd
pnpm create vue
```

选择Router、Pinia、ESLint、Prettier

## 初始化

```
# cmd
pnpm i
```

## 运行

```
# cmd
pnpm dev
```

## 配置eslint&prettier

eslint.config.js配置eslint规则
.prettierrc.json配置prettier规则
建议不要在eslint配置prettier规则
vscode安装ESLint、Prettier插件

## 配置husky

用于git commit提交时执行命令

```
# cmd
pnpm dlx husky-init && pnpm i
```

```
# .husky/pre-commit
echo *
pnpm *
npx *
```

### 配置环境

使用时，需保证所有环境支持node

## 配置lint-staged

用于只校验暂存区

```
# cmd
pnpm i lint-staged -D
```

```
// package.json
"scripts": {
  "lintstaged": "lint-staged"
},
"lint-staged": {
  "*.{vue,js,ts}": [
    "eslint --fix"
  ]
}
```

```
# cmd
pnpm lint-staged
```

```
# .husky/pre-commit
npx lint-staged
```

## 调整src目录

删除assets、components、stores、views目录下所有文件
删除app.vue、main.js、router/index.js下多余代码
创建utils、api目录

```
# cmd
pnpm i sass -D
```

## 配置element-plus

```
# cmd
pnpm i element-plus
pnpm i -D unplugin-vue-components unplugin-auto-import
pnpm i @element-plus/icons-vue

// vite.config.js
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

plugins: [
  AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
],
```

组件可以不用导入直接使用
文档：https://element-plus.org/zh-CN/component/overview

## 配置pinia

src/stores创建index.js
src/stores创建并配置/modules/\*.js

```
# cmd
pnpm i pinia-plugin-persistedstate

// stores/index.js
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
export default createPinia().use(persist)
export * from './modules/*'

// main.js
import pinia from './stores'
app.use(pinia)
```

## 配置axios

```
# cmd
pnpm i axios
```

src/utils创建request.js

```
// request.js
import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'
const baseURL = *
const instance = axios.create({
  baseURL
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    if (useUserStore().token) {
      config.headers.* = useUserStore().token // 携带token
    }
    return config
  },
  (err) => Promise.reject(err)
)

// 响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 成功
    if (res.data.code == 200) {
      return res
    }
    // 失败
    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // 401 权限不足 或 token 过期
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // 错误
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
```

## 配置router

区分一二级路由，并在views创建路由组件

```
// router.js
routes: [{
  path: '/',
  component: () => import('@/views/*.vue'),
  redirect: '/home',
  children: [{
    path: '/home',
    component: () => import('@/views/*.vue')
  }]
}]
// 登陆校验
router.beforeEach((to) => {
  if (*) return '/login'
})
```

## 获取富文本库quill

地址：https://vueup.github.io/vue-quill/

```
# cmd
pnpm i @vueup/vue-quill@latest

// js
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
```
