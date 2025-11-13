import { http } from '@/utils/http'

/** 身份信息项 */
export type UserGroupItem = {
  /** 名称 */
  title: string
  /** 图标 */
  icon: string
  /** 身份id */
  id: number
}

/** 身份列表响应 */
export type UserGroupListResult = {
  /** 身份列表数据 */
  data?: UserGroupItem[]
  /** 响应消息 */
  msg?: string
  /** 响应状态码 */
  code?: number
}

/** 获取身份列表 */
export const getUserGroupListAPI = () => {
  return http<UserGroupListResult>({
    method: 'GET',
    url: '/api/agreement/user_group',
  })
}
