import request from '@/utils/request'
import { get, post } from '@/utils/request'

// 获取文章分类列表
export const getClassList = data => get('/my/cate/list', data)

// 添加文章分类
export const addClass = data => post('/my/cate/add', data)

// 编辑文章分类
export const setClass = data => request.put('/my/cate/info', data)

// 删除文章分类
export const delClass = data => request.delete('/my/cate/del', { params: data })

// 获取文章列表
export const getDocumentList = data => get('/my/article/list', data)

// 添加文章
export const addDocument = data => post('/my/article/add', data)

// 获取文章详情
export const getDocumentInfo = data => get('/my/article/info', data)

// 编辑文章
export const setDocument = data => request.put('/my/article/info', data)

// 删除文章
export const delDocument = data => request.delete('/my/article/info', { params: data })
