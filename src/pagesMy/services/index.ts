import { http } from '@/utils/http'

// 房源项类型
export interface HouseItem {
  title: string
  area: string
  created_at: string
  province_name: string
  city_name: string
  district_name: string
  street_name: string
  address: string
  price: string
  add_time: string
}

// 我的卖房响应数据类型
export interface MySellHouseData {
  data: HouseItem[]
  per_page: number
  current_page: number
}

// 我的卖房响应类型
export interface MySellHouseResponse {
  data: MySellHouseData
  msg: string
  code: number
  current_page: number
  per_page: number
  list: HouseItem[]
}

// 我的卖房请求参数
export interface MySellHouseParams {
  page?: number
  per_page?: number
}

// 我的卖房
export const getMySellHouseAPI = (params?: MySellHouseParams) => {
  return http<MySellHouseResponse>({
    method: 'GET',
    url: '/api/user/get_department_list',
    data: params,
  })
}
