import { http } from '@/utils/http'

// 协议数据类型
export interface AgreementData {
  title?: string // 标题
  created_at?: string // 创建时间
  content?: string // 内容
}

// 协议响应类型
export interface AgreementResponse {
  code?: number
  msg?: string
  data?: AgreementData
  title?: string // 标题
  created_at?: string // 创建时间
  content?: string // 内容
}

// 隐私协议获取
export const getAgreementAPI = (id: string) => {
  return http<AgreementResponse>({
    method: 'GET',
    url: '/api/agreement/info',
    data: {
      id,
    },
  })
}
