export interface ActionButton {
  label: string
  action: string
}

export interface StaffAuthItem {
  id: string | number
  image: string
  title: string
  code: string // 编号
  district: string // 小区
  datetime: string // 时间
  status: string[] // 状态标签数组(待签约、签约等)
}
