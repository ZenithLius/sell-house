import type { LoginResult, UserInfo } from '@/types/member'
import { http } from '@/utils/http'

type LoginWxMinParams = {
  code: string
  encryptedData?: string
  iv?: string
  type?: string
}
/**
 * 小程序登录
 * @param data 请求参数
 */
export const postLoginWxMinAPI = (params: LoginWxMinParams) => {
  return http<LoginResult>({
    method: 'GET',
    url: '/api/auth/login',
    data: params,
  })
}

/**
 * 获取用户信息
 * @param data 请求参数
 */
export const getUserInfoAPI = () => {
  return http<UserInfo>({
    method: 'GET',
    url: '/api/user/info',
  })
}
