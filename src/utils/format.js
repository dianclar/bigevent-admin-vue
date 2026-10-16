import { dayjs } from 'element-plus'
export const formatTime = date => dayjs(date).format('YYYY-MM-DD HH:mm:ss')
