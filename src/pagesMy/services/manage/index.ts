import { http } from '@/utils/http'

// 获取员工列表
export const getStaffListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/district_manager/agent_employee_list',
    data: params,
  })
}

// 房源列表
export const getHouseListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/district_manager/get_house_list',
    data: params,
  })
}

// 员工业绩
export const getPerformanceListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/district_manager/employee',
    data: params,
  })
}

/**
 * ==========================================================================
 *                                 @上架审核
 * ==========================================================================
 */

// 上架审核
export const getShelfExamineAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/district_manager/shelf_examine',
    data: params,
  })
}
