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
    | 'line'
    | 'upload-video'
    | 'radio-group'
    | 'select-multiple'
  placeholder?: string
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  unit?: string
  required?: boolean
  options?: { title?: string; id: any; nickname?: string; phone?: string; mobile?: string }[]
  maxCount?: number
  visible?: boolean | ((form: Record<string, any>) => boolean)
  showLabel?: boolean
  col?: number
  span?: number
  radioLabel?: string
  radioKey?: string
  weight?: 'normal' | 'bold'
  desc?: string
}
