import { http } from '@/utils/http'

// 经纪人房源列表
export const getAgentHouseListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/agent/index',
    data: params,
  })
}

// 内部员工列表
export const getStaffListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee_house/get_house_list',
    data: params,
  })
}

// 获取小区数据
export const getCommunityListAPI = () => {
  return http<any>({
    method: 'GET',
    url: '/api/news/get_pharmacist_list',
  })
}
