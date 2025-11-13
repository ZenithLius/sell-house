import { http } from '@/utils/http'

// 资讯分类返回类型
export type ConsultCategoryItem = {
  title: string
  id: number
  badge?: boolean
  type: number
}

// 资讯列表项类型
export type ConsultListItem = {
  id: string | number
  title: string
  create_time: string
  add_time: string
  cover_url: string
  subtitle: string
  type_id?: number
}

// 资讯列表返回类型
export type ConsultListResult = {
  list: ConsultListItem[]
  total?: number
  page?: number
  per_page?: number
}

// 资讯详情返回类型
export type ConsultDetailResult = {
  id: string | number
  title: string
  create_time: string
  add_time: string
  cover_url: string
  subtitle: string
  content: string
  [key: string]: any
}

// 资讯分类
export const getConsultCategoryAPI = () => {
  return http<ConsultCategoryItem[]>({
    method: 'GET',
    url: '/api/news/news_type_list',
  })
}

// 资讯列表
export const getConsultListAPI = (params: { type_id: number; page: number; per_page: number }) => {
  return http<ConsultListResult>({
    method: 'GET',
    url: '/api/news/news_list_by_type',
    data: params,
  })
}

// 资讯详情
export const getConsultDetailAPI = (params: { id: number }) => {
  return http<ConsultDetailResult>({
    method: 'GET',
    url: '/api/news/news_detail',
    data: params,
  })
}
