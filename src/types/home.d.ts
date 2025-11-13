import type { GoodsItem } from './global'

/** 首页-广告区域数据类型 */
export type BannerItem = {
  /** 跳转链接 */
  hrefUrl?: string
  /** id */
  id?: string
  /** 图片链接 */
  picurl: string
  /** 跳转类型 */
  type?: number
}

/** 首页-前台类目数据类型 */
export type CategoryItem = {
  /** 图标路径 */
  icon: string
  /** id */
  id: string
  /** 分类名称 */
  name: string
  /** 跳转路径 */
  url: string
}

/** 公告数据类型 */
export type NoticeItem = {
  /** 编号 */
  id?: number
  /** 名称 */
  title?: string
  /** 分类id */
  type_id?: number
}

/** 房源数据类型（后台返回） */
export interface HomeItem {
  /** 房源ID */
  id?: number
  /** 房名称 */
  title?: string
  /** 房名称 */
  house_list_title?: string
  /** 室 */
  style_bedroom?: number
  /** 厅 */
  style_livingroom?: number
  /** 佣金 */
  commission?: string | null
  /** 总价 */
  total_price?: string
  /** 原来总价，和总价比 显示上升还是下降 */
  old_total_price?: string
  /** 单价 */
  per_price?: string
  /** 面积 */
  house_area?: string
  /** 房源楼层 */
  now_floor?: number
  /** 总楼层 */
  total_floor?: number
  /** 楼层图片 */
  floor_img?: string
  /** 特色房源IDs */
  feature_house_ids?: string
  /** 小区名称 */
  pharmacist_title?: string
  /** 区域ID */
  district_id?: number
  /** 图片 */
  pic_img?: string
  /** 浏览数 */
  view_count?: number
  /** 关注数 */
  follow_count?: number
  /** 咨询数 */
  contact_count?: number
  /** 带看数 */
  look_count?: number
  /** 0不能看到佣金，1可以看到佣金 */
  is_commission?: number
  is_show_commission?: number
  /** 房源特色 */
  feature_house_title?: string | string[] | null
  /** 房源小区名 */
  pharmacist_name?: string
  /** 房源小区l嘞你下个 */
  style_house_title?: string
}

/** 房源列表响应类型 */
export interface HomeListResult {
  /** 房源列表 */
  list: HomeItem[]
}

/** 筛选-区域项 */
export interface AreaItem {
  /** 区域ID */
  id: number
  /** 区域名称 */
  title: string
  /** 是否选中 */
  selected?: boolean
}

/** 筛选-价格项（总价/单价） */
export interface PriceItem {
  /** 价格ID */
  id: number
  /** 最低价格 */
  min_price: number
  /** 最高价格 */
  max_price: number
  /** 是否选中 */
  selected?: boolean
}

/** 筛选-户型项 */
export interface LayoutItem {
  /** 户型ID（数字代表几室，最后一个就显示几室以上） */
  order_id: number
  /** 是否选中 */
  selected?: boolean
}

/** 筛选-类型项 */
export interface TypeItem {
  /** 类型ID */
  id: number
  /** 类型名称 */
  title: string
  /** 是否选中 */
  selected?: boolean
}

/** 筛选-建筑面积项 */
export interface AreaRangeItem {
  /** 面积ID */
  id: number
  /** 最小面积 */
  min_area: number
  /** 最大面积 */
  max_area: number
  /** 是否选中 */
  selected?: boolean
}

/** 筛选-朝向项 */
export interface OrientationItem {
  /** 朝向ID */
  id: number
  /** 朝向名称 */
  title: string
  /** 是否选中 */
  selected?: boolean
}

/** 筛选-特色项 */
export interface FeatureItem {
  /** 特色ID */
  id: number
  /** 特色名称 */
  title: string
  /** 是否选中 */
  selected?: boolean
}

/** 房源详情数据类型（接口返回） */
export interface HouseDetailResult {
  /** 房源ID */
  id?: number
  /** 朝向ID */
  exposure_house_id?: number
  /** 建筑结构ID */
  structure_house_id?: number
  /** 特色房源标题 */
  feature_house_title?: string
  /** 详细单元 */
  detail_unit?: number
  /** 详细室 */
  detail_room?: number
  /** 详细栋 */
  detail_building?: number
  /** 视频地址 */
  video_url?: string | null
  /** VR地址 */
  vr_url?: string | null
  /** 房源编码 */
  house_code?: string
  /** 标题 */
  title?: string
  /** 几室 */
  style_bedroom?: number
  /** 几厅 */
  style_livingroom?: number
  /** 佣金 */
  commission?: string | null
  /** 总价 */
  total_price?: string
  /** 原总价 */
  old_total_price?: string
  /** 单价 */
  per_price?: string
  /** 建面 */
  house_area?: string
  /** 当前楼层 */
  now_floor?: number
  /** 总楼层 */
  total_floor?: number
  /** 实勘图 */
  floor_img?: string
  /** 用户ID */
  user_id?: number
  /** 轮播图 */
  mul_img?: string | null
  /** 户型图 */
  room_img?: string | null
  /** 特色房源IDs */
  feature_house_ids?: string
  /** 用途ID */
  use_house_id?: number
  /** 装修ID */
  decoration_house_id?: number
  /** 类型ID */
  style_house_id?: number
  /** 电梯ID */
  lift_house_id?: number
  /** 产权ID */
  property_house_id?: number
  /** 户口ID */
  place_house_id?: number
  /** 楼户比例-梯 */
  lift_num?: number
  /** 楼户比例-户 */
  home_num?: number | null
  /** 年代 */
  delivery_date?: string
  /** 小区名称 */
  pharmacist_title?: string
  /** 省 */
  province_title?: number
  /** 市 */
  city_title?: number
  /** 区 */
  district_title?: number
  /** 街道 */
  street_title?: number
  /** 地址 */
  address?: string
  /** 交通 */
  transportation?: string
  /** 教育 */
  education?: string
  /** 医疗 */
  medical?: string
  /** 生活 */
  entertainment?: string
  /** 朝向标题 */
  exposure_house_title?: string
  /** 建筑结构标题 */
  structure_house_title?: string
  /** 产权情况标题 */
  property_house_title?: string
  /** 户口标题 */
  place_house_title?: string
  /** 用途标题 */
  use_house_title?: string
  /** 装修标题 */
  decoration_house_title?: string
  /** 类型标题 */
  style_house_title?: string
  /** 配备电梯标题 */
  lift_house_title?: string
  /** 是否关注 1已关注，0未关注 */
  is_follow?: number
  /** 分享姓名 */
  share_user_name?: string
  /** 分享电话 */
  share_user_mobile?: string
}
