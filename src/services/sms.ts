import { http } from '@/utils/http'

// 发送短信验证码
export const sendSmsCodeAPI = (mobile: string | number) => {
  return http<any>({
    method: 'GET',
    url: '/api/sms/send',
    data: {
      mobile,
    },
  })
}
