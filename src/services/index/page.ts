import { http } from '@/utils/http'
import type {
  BannerItem,
  HomeListResult,
  AreaItem,
  PriceItem,
  LayoutItem,
  TypeItem,
  AreaRangeItem,
  OrientationItem,
  FeatureItem,
  HouseDetailResult,
  NoticeItem,
} from '@/types/home'

// 轮播图
export const getIndexBannerAPI = () => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/api/news/banner',
  })
}

// 首页公告
export const getIndexNoticeAPI = () => {
  return http<BannerItem[]>({
    method: 'GET',
    url: '/api/news/news_list_recommend',
  })
}

// 房源列表参数接口
export interface HouseListParams {
  district_id?: number // 区域id
  min_price?: number // 单价区间最低价格
  max_price?: number // 单价区间最高价格
  total_min_price?: number // 总价区间最低价格
  total_max_price?: number // 总价区间最高价格
  style_house_id?: number // 类型id
  style_bedroom_num?: number // 户型的数字 order_id
  min_area?: number // 建筑面积最小值
  max_area?: number // 建筑面积最大值
  exposure_house_id?: number // 朝向id
  feature_house_ids?: number // 特色
  keyword?: string // 关键词
  is_recommend?: number // 1推荐,0所有
  page?: number // 页码
  per_page?: number // 每页数量
}

// 房源列表
export const getIndexHouseListAPI = (params?: HouseListParams) => {
  return http<HomeListResult>({
    method: 'GET',
    url: '/api/house_list/index',
    data: params,
  })
}

// 获取区域列表
export const getAreaListAPI = () => {
  return http<AreaItem[]>({
    method: 'GET',
    url: '/api/news/get_region_list',
  })
}

// 获取价格列表(总价)
export const getPriceTotalListAPI = () => {
  return http<PriceItem[]>({
    method: 'GET',
    url: '/api/news/get_total_house_list',
  })
}

// 获取价格列表(单价)
export const getPriceUnitListAPI = () => {
  return http<PriceItem[]>({
    method: 'GET',
    url: '/api/news/get_unit_house_list',
  })
}

// 获取户型列表
export const getLayoutListAPI = () => {
  return http<LayoutItem[]>({
    method: 'GET',
    url: '/api/news/get_type_house_list',
  })
}

// 获取类型列表
export const getTypeListAPI = () => {
  return http<TypeItem[]>({
    method: 'GET',
    url: '/api/news/get_style_house_list',
  })
}

// 更多（建筑面积）
export const getMoreAreaListAPI = () => {
  return http<AreaRangeItem[]>({
    method: 'GET',
    url: '/api/news/get_area_house_list',
  })
}

// 更多（朝向）
export const getMoreOrientationListAPI = () => {
  return http<OrientationItem[]>({
    method: 'GET',
    url: '/api/news/get_exposure_house_list',
  })
}

// 更多（特色）
export const getMoreFeatureListAPI = () => {
  return http<FeatureItem[]>({
    method: 'GET',
    url: '/api/news/get_feature_house_list',
  })
}

// 房源详情参数接口
export interface HouseDetailParams {
  id: string // 房源ID
  share_user_id?: string // 分享用户ID
}

// 房源详情
export const getHouseDetailAPI = (params: HouseDetailParams) => {
  return http<HouseDetailResult>({
    method: 'GET',
    url: `/api/house_list/get_detail`,
    data: params,
  })
}

// 公告列表
export const getNoticeListAPI = () => {
  return http<NoticeItem[]>({
    method: 'GET',
    url: '/api/news/news_list_recommend',
  })
}

// 关注/取消关注
export const getToggleFollowAPI = (house_list_id: number) => {
  return http<any>({
    method: 'GET',
    url: '/api/following_history/toggle_follow',
    data: {
      house_list_id,
    },
  })
}

// 注册协议
// 关于我们传15-注册协议传24-安全协议25-隐私政策26
export const getRegisterAgreementAPI = (id: number) => {
  return http<any>({
    method: 'GET',
    url: '/api/agreement/info',
    data: {
      id,
    },
  })
}

// 反馈参数接口
export interface FeedbackParams {
  nickname: string // 姓名
  sex: string // 性别: 1男，2女
  mobile: string // 手机号
  content: string // 内容
  house_list_id: string // 房源id
}

// 我要反馈
export const getFeedbackAPI = (params: FeedbackParams) => {
  return http<any>({
    method: 'GET',
    url: '/api/feedback/feedback',
    data: params,
  })
}

// 关注列表参数接口
export interface FollowListParams {
  page?: number // 页码
  per_page?: number // 每页数量
}

// 获取关注列表
export const getFollowListAPI = (params?: FollowListParams) => {
  return http<HomeListResult>({
    method: 'GET',
    url: '/api/following_history/list',
    data: params,
  })
}

//获取浏览记录
export const getViewListAPI = (params?: FollowListParams) => {
  return http<HomeListResult>({
    method: 'GET',
    url: '/api/view_history/list',
    data: params,
  })
}

// 获客列表
export const getVisitorListAPI = (data?: { page?: number; per_page?: number }) => {
  return http<any>({
    method: 'GET',
    url: '/api/agent/agent_history',
    data,
  })
}
