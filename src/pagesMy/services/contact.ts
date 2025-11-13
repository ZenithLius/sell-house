import { http } from '@/utils/http'

// 客服列表项类型
export interface ContactItem {
  name: string // 名称
  contact: string // 工作时间
  phone: string // 电话
}

// 客服列表响应数据类型
export interface ContactListData {
  total?: number
  list?: ContactItem[]
  per_page?: number
  current_page?: number
}

// 客服列表响应类型
export interface ContactListResponse {
  code?: number
  msg?: string
  data?: ContactListData
  total?: number
  list?: ContactItem[]
  per_page?: number
  current_page?: number
}

//获取客服列表
export const getContactListAPI = () => {
  return http<ContactListResponse>({
    method: 'GET',
    url: '/api/news/list',
  })
}
