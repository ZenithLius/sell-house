import { http } from '@/utils/http'

// 区域数据类型（接口返回）
export type AreaData = {
  id: number
  title: string
}

// 区域列表
export const getAreaListAPI = () => {
  return http<AreaData[]>({
    method: 'GET',
    url: '/api/news/get_region_list',
  })
}

// 卖房请求参数类型
export type SellHouseParams = {
  id?: string // 默认传空预留
  username: string // 姓名
  phone: string // 电话
  title?: string // 小区名称
  province_code?: string // 省code
  province_name?: string // 省名称
  city_code?: string // 市code
  city_name?: string // 市名称
  district_code?: string // 区code
  district_name?: string // 区名称
  street_code?: string // 街道code
  street_name?: string // 街道名称
  address?: string // 地址
  area?: string // 面积
  price?: string // 价格
}

// 我要卖房
export const sellHouseAPI = (data: SellHouseParams) => {
  return http({
    method: 'POST',
    url: '/api/user/create_departments',
    data,
  })
}
