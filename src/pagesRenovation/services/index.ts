import { http } from '@/utils/http'

/**
 * ==========================================================================
 *                                 @房源列表相关
 * ==========================================================================
 */
// 装修负责人房源列表
export const getRenovationListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/project_manager/index',
    data: params,
  })
}
// 工长房源列表
export const getForemanListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/foreman/view_audit_list',
    data: params,
  })
}

/**
 * ==========================================================================
 *                                 @任务相关
 * ==========================================================================
 */

// 装修系统任务列表显示数据用的（最多的那个）
export const getTaskListAPI = (params: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/project_manager/task_house_index',
    data: params,
  })
}
