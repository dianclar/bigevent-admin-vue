import request from '@/utils/request'
import { get, post } from '@/utils/request'

// 注册用户
export const registerUser = data => post('/api/reg', data)

// 登录用户
export const loginUser = data => post('/api/login', data)

// 获取用户信息
export const getUserInfo = data => get('/my/userinfo', data)

// 修改个人资料
export const setUserInfo = data => request.put('/my/userinfo', data)

// 设置头像
export const setUserAvatar = data => request.patch('/my/update/avatar', data)

// 修改密码
export const setUserPass = data => request.patch('/my/updatepwd', data)
