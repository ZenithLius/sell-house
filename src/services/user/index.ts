import type { UpdateUserInfoParams } from '@/types/member'
import { http } from '@/utils/http'

/**
 * 更新用户信息
 * @param data 用户信息参数
 */
export const updateUserInfoAPI = (data: UpdateUserInfoParams) => {
  return http({
    method: 'POST',
    url: '/api/user/store',
    data,
  })
}
