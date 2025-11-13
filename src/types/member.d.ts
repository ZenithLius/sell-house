/** 通用的用户信息 */
type BaseProfile = {
  /** 用户ID */
  id: number
  /** 头像  */
  avatar: string
  /** 账户名  */
  account: string
  /** 昵称 */
  nickname?: string
  /** 所属公司 */
  company_tile?: string
  /** 手机号 */
  mobile: string
}

/** 小程序登录 登录用户信息 */
export type LoginResult = BaseProfile & {
  /** 登录凭证 */
  token: string
}

/** 个人信息 用户详情信息 */
export type ProfileDetail = BaseProfile & {
  /** 性别 */
  gender?: Gender
  /** 生日 */
  birthday?: string
  /** 省市区 */
  fullLocation?: string
  /** 职业 */
  profession?: string
}
/** 性别 */
export type Gender = '女' | '男'

/** 个人信息 修改请求体参数 */
export type ProfileParams = Pick<
  ProfileDetail,
  'nickname' | 'gender' | 'birthday' | 'profession'
> & {
  /** 省份编码 */
  provinceCode?: string
  /** 城市编码 */
  cityCode?: string
  /** 区/县编码 */
  countyCode?: string
}

/** 更新用户信息请求参数 */
export type UpdateUserInfoParams = {
  /** 头像 */
  avatar: string
  /** 姓名 */
  nickname: string
  /** 公司名称 */
  company_tile: string
  /** 电话 */
  mobile: string
}

/** 用户信息 (getUserInfoAPI 返回) */
export type UserInfo = {
  [key: string]: any
}
