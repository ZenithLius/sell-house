<template>
  <view>
    <up-loading-page color="#863FCE" loading-text="发送中..." :loading="loading"></up-loading-page>

    <ShCustomForm v-model="formData" :fields="fields" @sendCode="handleSendCode" />

    <SubmitSection
      v-model:agreed-to-terms="agreedToTerms"
      @view-agreement="handleViewAgreement"
      @submit="handleSubmit"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import SubmitSection from './SubmitSection.vue'
import { getUserGroupListAPI } from '@/services/userGroup'
import { sendSmsCodeAPI } from '@/services/sms'
import { authenticationAPI } from '@/services/my'

const props = defineProps<{
  type?: string // 经纪人 agent  内部员工 staff，片区经理 manager，投资人 investment 房屋装修 renovation
}>()

const emit = defineEmits<{
  (e: 'view-agreement'): void
  (e: 'submit', payload: any): void
  (e: 'success', response: any): void
}>()

const loading = ref(false)
const agreedToTerms = ref(false)

// 发送验证码
const handleSendCode = async (phone: string) => {
  loading.value = true
  const res = await sendSmsCodeAPI(phone)
  loading.value = false
  if (res.code === 200) {
    uni.showToast({
      title: '验证码已发送',
      icon: 'none',
    })
  }
}

const identityOptions = ref<{ title: string; id: number }[]>([])

const handleViewAgreement = () => {
  emit('view-agreement')
}

type FormData = {
  username: string | number
  mobile: string
  code: string
  user_level_id: string | number
  company_title: string
  type: string
  id: string
}

const formData = ref<FormData>({
  username: '',
  mobile: '',
  code: '',
  user_level_id: '',
  company_title: '',
  type: '',
  id: '',
})

type CustomFormField = {
  key: string
  label: string
  type?: 'input' | 'textarea' | 'select' | 'code'
  placeholder?: string
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  unit?: string
  required?: boolean
  options?: { title: string; id: any }[]
}

const fields = computed<CustomFormField[]>(() => {
  const baseFields: CustomFormField[] = [
    {
      key: 'user_level_id',
      label: '身份选择',
      type: 'select',
      placeholder: '请选择',
      options: identityOptions.value,
      required: true,
    },
    { key: 'username', label: '姓名', type: 'input', placeholder: '请输入', required: true },
    {
      key: 'mobile',
      label: '手机号',
      type: 'input',
      placeholder: '请输入',
      inputType: 'number',
      required: true,
    },
    {
      key: 'code',
      label: '验证码',
      type: 'code',
      placeholder: '请输入',
      inputType: 'number',
      required: true,
    },
  ]

  // 经纪人额外字段
  if (props.type === 'agent') {
    baseFields.push({
      key: 'company_title',
      label: '中介公司',
      type: 'input',
      placeholder: '请输入',
      inputType: 'text',
      required: true,
    })
  }

  return baseFields
})

const handleSubmit = async () => {
  if (!agreedToTerms.value) {
    uni.showToast({
      title: '请先同意注册协议',
      icon: 'none',
    })
    return
  }

  // 对外抛出提交事件
  emit('submit', formData.value)

  const res = await authenticationAPI(formData.value)
  uni.showToast({
    title: '提交成功',
    icon: 'success',
  })
  emit('success', res)
}

onMounted(() => {
  // 获取身份列表
  getUserGroupListAPI().then((res: any) => {
    const raw: any = res
    let list: any[] = []
    if (Array.isArray(raw)) {
      list = raw
    } else if (Array.isArray(raw.data)) {
      list = raw.data
    }

    identityOptions.value = (list || []).map((it: any) => ({ title: it.title, id: it.id }))

    // 根据当前 type 设置默认选中
    const typeTitleMap: Record<string, string> = {
      agent: '经纪人',
      staff: '内部员工',
      manager: '片区经理',
      investment: '投资人',
      renovation: '装修负责人',
    }
    const targetTitle = props.type ? typeTitleMap[props.type] : ''
    if (targetTitle) {
      const match = identityOptions.value.find((o) => o.title === targetTitle)
      if (match) {
        formData.value.user_level_id = match.id
      }
    }
  })
})
</script>

<style scoped></style>
