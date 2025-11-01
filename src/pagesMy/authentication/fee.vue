<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'费用列表'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <!-- list -->
      <FeeList :list="feeList" :loading="loading" :hasMore="hasMore" @loadMore="loadMore" />
    </view>
    <ShBottomBtns
      v-if="currentRole !== 'manager'"
      :buttons="bottomButtons"
      @click="handleButtonClick"
    />
    <BottomTabbar />
    <view class="pop" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <ShPopup
        ref="addFeePopup"
        title="添加费用"
        @cancel="handlePopupCancel"
        @confirm="handlePopupConfirm"
      >
        <ShCustomForm v-model="formData" :fields="fields" />
      </ShPopup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FeeList from './components/FeeList.vue'
import BottomTabbar from './components/BottomTabbar.vue'
import ShPopup from '@/components/ShPopup.vue'
interface FeeItem {
  id: string | number
  title: string
  amount: number
  time: string
  remark: string
}

const { safeAreaInsets } = uni.getSystemInfoSync()
const currentRole = uni.getStorageSync('currentOtherManageType')
import type { CustomFormField } from '@/types/customFormField'
const formData = ref({
  area: '',
  feeName: '',
  feeAmount: '',
  idCard: '',
})

const fields: CustomFormField[] = [
  {
    key: 'area',
    label: '费用类型',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '费用类型1', value: '1' },
      { label: '费用类型2', value: '2' },
      { label: '费用类型3', value: '3' },
      { label: '其他', value: '4' },
    ],
  },
  {
    key: 'feeName',
    label: '费用名称',
    placeholder: '请输入',
    type: 'input',
    visible: (form) => form.area === '4',
  },
  {
    key: 'feeAmount',
    label: '费用金额',
    inputType: 'digit',
    placeholder: '请输入',
    type: 'input',
  },
  { key: 'idCard', label: '备注', placeholder: '请输入', type: 'textarea' },
]

watch(
  () => formData.value.area,
  (newVal) => {
    if (newVal !== '4') {
      formData.value.feeName = ''
    }
  },
)

const bottomButtons = [
  {
    text: '新增费用',
    background: '#863fce',
    color: '#ffffff',
  },
]

// 弹窗引用
const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)

const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('新增费用')
    addFeePopup.value?.open()
  }
}

// 弹窗取消
const handlePopupCancel = () => {
  console.log('取消添加费用')
}

// 弹窗确认
const handlePopupConfirm = () => {
  console.log('确认添加费用')
  // TODO: 这里添加表单验证和提交逻辑
  // 提交成功后关闭弹窗
  addFeePopup.value?.close()
}

// 数据状态
const feeList = ref<FeeItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 10

// 初始化加载数据
const loadFeeList = async (page: number) => {
  loading.value = true
  try {
    // TODO: 替换为实际的API请求
    // const res = await getFeeListAPI({ page, pageSize })

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    const mockData: FeeItem[] = Array.from({ length: pageSize }, (_, index) => ({
      id: (page - 1) * pageSize + index + 1,
      title: '收房价',
      amount: 120000.0,
      time: '2025.09.01 10:0:00',
      remark: '省注文字介绍省注文字介绍省注文字介绍省注文字介绍省注文字介绍',
    }))

    if (page === 1) {
      feeList.value = mockData
    } else {
      feeList.value = [...feeList.value, ...mockData]
    }

    // 模拟最多3页数据
    hasMore.value = page < 3
  } catch (error) {
    console.error('加载费用列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 触底加载更多
const loadMore = () => {
  if (!hasMore.value || loading.value) {
    return
  }
  currentPage.value++
  loadFeeList(currentPage.value)
}

// 返回
const handleBack = () => {
  uni.navigateBack()
}

// 页面加载时获取数据
loadFeeList(1)
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #f7f8fc;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}
</style>
