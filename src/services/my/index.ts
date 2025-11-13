import { http } from '@/utils/http'

/** 反馈列表请求参数 */
export interface FeedbackListParams {
  /** 是否已回复：0未回复，1已回复 */
  is_answer: string
}

/** 反馈项 */
export interface FeedbackItem {
  answer_content?: string //回馈内容
  created_at?: string //创建时间
  content?: string //反馈内容
  pharmacist_title?: string //小区
  house_list_title?: string //房源
  created_time?: string //时间
}

/** 反馈列表返回数据 */
export interface FeedbackListResult {
  /** 总数 */
  total?: number
  /** 反馈列表 */
  list: FeedbackItem[]
  /** 每页数量 */
  per_page?: number
  /** 当前页码 */
  current_page?: number
}

/** 我的反馈接口 */
export const getFeedbackListAPI = (params: FeedbackListParams) => {
  return http<FeedbackListResult>({
    method: 'POST',
    url: '/api/feedback/my_feedback',
    data: params,
  })
}

/** 消息列表请求参数 */
export interface MessageListParams {
  /** 页码 */
  page?: number
  /** 每页数量 */
  per_page?: number
}

/** 消息项 */
export interface MessageItem {
  /** 房源ID */
  house_list_id?: number
  /** 创建时间 */
  created_at?: string
  /** 房源编码 */
  house_code?: string
  /** 房源名称 */
  house_list_title?: string
  /** 小区名称 */
  pharmacist_title?: string
  /** 朝向ID */
  exposure_house_id?: number
  /** 装修ID */
  decoration_house_id?: number
  /** 朝向 */
  exposure_house_title?: string
  /** 装修 */
  decoration_house_title?: string
  /** 创建时间 */
  create_time?: string
}

/** 消息列表返回数据 */
export interface MessageListResult {
  /** 总数 */
  total?: number
  /** 消息列表 */
  list: MessageItem[]
  /** 每页数量 */
  per_page?: number
  /** 当前页码 */
  current_page?: number
}

/** 消息列表响应 */
export interface MessageListResponse {
  dangerList: MessageListResult
  msg?: string
  code?: number
}

/** 我的消息接口 */
export const getMessageListAPI = (params?: MessageListParams) => {
  return http<MessageListResponse>({
    method: 'GET',
    url: '/api/employee_house/danger_message',
    data: params,
  })
}

// 认证相关
export const authenticationAPI = (params: any) => {
  return http<any>({
    method: 'POST',
    url: '/api/user/authentication',
    data: params,
  })
}
