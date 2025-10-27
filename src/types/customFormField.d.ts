export type CustomFormField = {
  head?: string
  key: string
  label: string
  type?:
    | 'input'
    | 'textarea'
    | 'select'
    | 'date'
    | 'upload'
    | 'idCard'
    | 'selectSearch'
    | 'none'
    | 'radio'
  placeholder?: string
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  unit?: string
  required?: boolean
  options?: { label: string; value: any; phone?: string }[]
  maxCount?: number
  visible?: boolean | ((form: Record<string, any>) => boolean)
  showLabel?: boolean
  col?: number
  span?: number
  radioLabel?: string // 用于 radio 类型的标题文字
  radioKey?: string // 用于存储 radio 选中状态的 key
}
