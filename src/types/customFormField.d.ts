export type CustomFormField = {
  head?: string
  key: string
  label: string
  type?: 'input' | 'textarea' | 'select' | 'date' | 'upload' | 'idCard' | 'selectSearch'
  placeholder?: string
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  unit?: string
  required?: boolean
  options?: { label: string; value: any; phone?: string }[]
  maxCount?: number
  visible?: boolean | ((form: Record<string, any>) => boolean)
}
