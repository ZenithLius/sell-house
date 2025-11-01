/** 过滤器选项 */
export interface FilterOption {
  label: string
  value: string | number
}

/** 分组筛选配置 */
export interface FilterGroup {
  title: string

  key?: string

  options: FilterOption[]
}

/** 过滤器配置 */
export interface FilterConfig {
  label: string
  options: FilterOption[] // 可选项列表（平铺模式）
  /** 分组模式（有小标题）。若提供则按分组渲染；未提供则按 options 平铺渲染 */
  groups?: FilterGroup[]
}
