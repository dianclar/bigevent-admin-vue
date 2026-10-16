import axios from 'axios'

/**
 * 将图片 URL 转换为 File 对象（使用 axios）
 * @param {string} imgUrl - 图片的 URL（需支持 CORS）
 * @param {string} filename - 文件名（默认 'image.jpg'）
 * @param {string} mimeType - MIME 类型（默认自动检测，fallback 为 'image/jpeg'）
 * @returns {Promise<File>} 返回 File 对象的 Promise
 */
export const imgUrlToFile = async (imgUrl, filename = 'image.jpg', mimeType) => {
  try {
    // 1. 使用 axios 获取图片 Blob 数据
    const response = await axios.get(imgUrl, {
      responseType: 'blob', // ⚠️ 关键：指定返回类型为 blob
      headers: {
        // 如果需要，可添加自定义 headers（如 Authorization）
      },
      // 注意：axios 默认 mode: 'cors'，无需显式设置
    })

    const blob = response.data // axios 已经解析为 Blob

    // 2. 自动推断 MIME 类型（如果未提供）
    if (!mimeType) {
      mimeType = blob.type || 'image/jpeg'
    }

    // 3. 创建 File 对象
    const file = new File([blob], filename, { type: mimeType })

    return file
  } catch (error) {
    // axios 会自动抛出网络错误或 HTTP 错误（如 404、500）
    throw new Error(`Failed to fetch image: ${error.message || 'Unknown error'}`)
  }
}
