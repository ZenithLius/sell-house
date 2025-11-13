import { http } from '@/utils/http'

/**
 * ==========================================================================
 *                                 @房型相关
 * ==========================================================================
 */

// 室，厅，卫，厨，阳台
export const getNumListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_num_list',
  })
}

// 户型结构
export const getHouseTypeListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_type_house_list',
  })
}
// 房屋朝向
export const getHouseOrientationListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_exposure_house_list',
  })
}
// 建筑结构管理
export const getBuildingStructureListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_structure_house_list',
  })
}
// 装修情况
export const getDecorationListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_decoration_house_list',
  })
}

// 配备电梯
export const getElevatorListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_lift_house_list',
  })
}

// 房屋用途
export const getHousePurposeListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_use_house_list',
  })
}

// 户口
export const getPlaceHouselistAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_place_house_list',
  })
}

// 产权情况
export const getOwnershipListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_property_house_list',
  })
}

// 特色标签
export const getFeatureListAPI = () => {
  return http({
    method: 'GET',
    url: '/api/news/get_feature_house_list',
  })
}

/**
 * ==========================================================================
 *                                 @实勘房源保存
 * ==========================================================================
 */

export const publishHouseAPI = (data: any) => {
  return http({
    method: 'POST',
    url: '/api/employee/publish',
    data,
  })
}

/**
 * ==========================================================================
 *                                 @员工打卡
 * ==========================================================================
 */

// 打卡记录项类型
export interface CheckInItem {
  user_id: string | number
  user_name: string // 员工姓名
  created_time: string // 打卡时间
  pic_url: string // 打卡图片
  [key: string]: any
}

// 打卡记录列表响应类型
export interface CheckInListData {
  list: CheckInItem[]
  total?: number
  [key: string]: any
}

// 打卡
export const checkInAPI = (data: any) => {
  return http<any>({
    method: 'POST',
    url: '/api/employee/clock',
    data,
  })
}

// 打卡记录
export const checkInListAPI = (data: any) => {
  return http<CheckInListData>({
    method: 'GET',
    url: '/api/employee/clockList',
    data: data,
  })
}

// 跟进记录列表（员工）
export const followRecordListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee/write_history_list',
    data: data,
  })
}

// 跟进记录列表（片区经理）
export const followRecordListManagerAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/agent/house_follow_up',
    data: data,
  })
}

interface write_history {
  title: string | number
  content: string
  mul_img: string
  house_list_id: string | number
}
// 新增跟进记录
export const addFollowRecordAPI = (data: write_history) => {
  return http<any>({
    method: 'POST',
    url: '/api/employee/create_write_history',
    data: data,
  })
}

// 确认上架
export const confirmOnShelfAPI = (house_list_id: string | number) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee_house/submit_examine',
    data: { house_list_id },
  })
}

// 装修记录
export const decorationRecordListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee_house/view_decoration_record',
    data: data,
  })
}

// 设置装修负责人
export const assignProjectManagerAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee_house/assign_project_manager',
    data: data,
  })
}

// 获取装修负责人
export const investorListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/user/get_investor_list',
    data: data,
  })
}

// 设置投资人
export const setInvestorAPI = (data: any) => {
  return http<any>({
    method: 'POST',
    url: '/api/employee/set_investor',
    data: data,
  })
}
/**
 * ==========================================================================
 *                                 @签约相关
 * ==========================================================================
 */

// 签约/续约
export const signAPI = (data: any) => {
  return http<any>({
    method: 'POST',
    url: '/api/employee/createSignInformation',
    data: data,
  })
}

// 签约详情
export const signDetailAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee/sign_information_detail',
    data: data,
  })
}

/**
 * ==========================================================================
 *                                 @费用相关
 * ==========================================================================
 */

// 费用类型
export const feeTypeListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/news/get_expense_type_list',
    data: data,
  })
}
// 费用列表（员工）
export const feeListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee/expense_list',
    data: data,
  })
}
// 费用列表（片区经理）
export const feeListManagerAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/district_manager/expense_house_list',
    data: data,
  })
}

// 新增费用
export const addFeeAPI = (data: any) => {
  return http<any>({
    method: 'POST',
    url: '/api/employee/add_expense',
    data: data,
  })
}

/**
 * ==========================================================================
 *                                 @手续相关
 * ==========================================================================
 */

// 创建手续费请求参数
export interface CreateProcedureParams {
  house_list_id: string | number // 房源ID
  remark: string // 备注
  type_id: string | number // 状态类型ID
}

// 手续费列表项
export interface ProcedureItem {
  id: number
  house_list_id: number
  remark: string
  type_id: number
  type_name: string
  created_at?: string
  updated_at?: string
  create_time?: string
}

// 手续费列表响应
export interface ProcedureListResponse {
  list: ProcedureItem[]
  total?: number
}

// 创建手续费
export const createProcedureAPI = (data: CreateProcedureParams) => {
  return http<any>({
    method: 'POST',
    url: '/api/employee_house/add_procedure_manage',
    data: data,
  })
}

// 手续费列表
export const procedureListAPI = (
  house_list_id: string | number,
  page?: number,
  pageSize?: number,
) => {
  return http<ProcedureListResponse>({
    method: 'GET',
    url: '/api/employee_house/get_procedure_manage_list',
    data: {
      house_list_id,
      page,
      per_page: pageSize,
    },
  })
}
// 获取手续状态
export const getProcedureStatusAPI = () => {
  return http<any>({
    method: 'GET',
    url: '/api/news/get_expense_status_list',
  })
}

/**
 * ==========================================================================
 *                                 @成交信息相关
 * ==========================================================================
 */

// 成交信息列表
export const dealRecordListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/employee_house/get_transaction_history_list',
    data: data,
  })
}

// 新增成交记录
export const addDealRecordAPI = (data: any) => {
  return http<any>({
    method: 'POST',
    url: '/api/employee_house/add_transaction_history',
    data: data,
  })
}

// 成交状态
export const getDealStatusAPI = () => {
  return http<any>({
    method: 'GET',
    url: '/api/news/get_transaction_status_list',
  })
}

/**
 * ==========================================================================
 *                                 @查看记录相关
 * ==========================================================================
 */

// 浏览记录
export const viewRecordListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/view_history/user_history_list',
    data: data,
  })
}

// 关注记录
export const followHistoryListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/following_history/user_history_list',
    data: data,
  })
}

// 开锁记录
export const lockRecordListAPI = (data: any) => {
  return http<any>({
    method: 'GET',
    url: '/api/following_history/user_unlock_history_list',
    data: data,
  })
}
