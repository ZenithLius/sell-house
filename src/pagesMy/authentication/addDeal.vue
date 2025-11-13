<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'新增成交'"
      :showBack="true"
      class="navbar-fixed"
    />
    <scroll-view scroll-y class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <ShCustomForm
        @fieldChangeSearch="handleFieldChangeSearch"
        v-model="formData"
        :fields="fields"
      />
    </scroll-view>
    <ShBottomBtns
      :buttons="bottomButtons"
      @click="handleButtonClick"
      :backgroundColor="'#ffffff'"
    />
    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import type { CustomFormField } from '@/types/customFormField'
import BottomTabbar from './components/BottomTabbar.vue'
import { ref } from 'vue'
import { addDealRecordAPI, getDealStatusAPI, investorListAPI } from '../services/staff'
import { onLoad } from '@dcloudio/uni-app'

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

/**
 * ==================================获取成交状态数据========================================
 */

const houseListId = ref<string | number>('')
const getDealStatusReq = async () => {
  const res = await getDealStatusAPI()

  const target = fields.value.find((f) => f.key === 'transaction_status_id')
  if (target) {
    target.options = res.data
  }
}

/**
 * ==================================获取经纪人数据========================================
 */
const keyword = ref('')
const handleFieldChangeSearch = (key: string) => {
  keyword.value = key
  getAgentListReq()
}
const getAgentListReq = async () => {
  const params = {
    type: '2',
    keyword: keyword.value,
  }
  uni.showLoading({
    title: '加载中',
  })
  const res = await investorListAPI(params)
  if (res.code === 200 && res.data.list.length > 0) {
    const target = fields.value.find((f) => f.key === 'agent_id')
    if (target) {
      target.options = res.data.list
    }
  }
  uni.hideLoading()
}

/**
 * ==================================提交数据========================================
 */
const submitReq = async () => {
  uni.showLoading({
    title: '保存中',
  })
  const params = {
    house_list_id: houseListId.value,
    transaction_status_id: formData.value.transaction_status_id,
    agent_id: formData.value.agent_id,
    total_price: formData.value.total_price,
    agency_fee: formData.value.agency_fee,
    award: formData.value.award,
    mul_img: formData.value.mul_img.join(','),
  }
  const res = await addDealRecordAPI(params)
  if (res.code === 200) {
    uni.showToast({
      title: '保存成功',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1000)
  } else {
    uni.showToast({
      title: res.msg || '保存失败',
      icon: 'none',
    })
  }
  uni.hideLoading()
}
onLoad((options) => {
  houseListId.value = options?.house_list_id || ''
  getDealStatusReq()
  getAgentListReq()
})

const formData = ref({
  transaction_status_id: '',
  agent_id: '',
  total_price: '',
  agency_fee: '',
  award: '',
  mul_img: [],
})

const fields = ref<CustomFormField[]>([
  {
    key: 'transaction_status_id',
    label: '成交状态',
    type: 'select',
    placeholder: '请选择',
    options: [],
  },
  {
    key: 'agent_id',
    label: '经纪人',
    type: 'selectSearch',
    placeholder: '请选择',
    options: [],
  },
  { key: 'total_price', label: '成交价格', type: 'input', unit: '元', inputType: 'digit' },
  { key: 'agency_fee', label: '出房中介费', type: 'input', unit: '元', inputType: 'digit' },
  { key: 'award', label: '出房成交奖', type: 'input', unit: '元', inputType: 'digit' },
  { key: 'mul_img', label: '成交合同', type: 'upload' },
])

const bottomButtons = [
  {
    text: '提交',
    background: '#863fce',
    color: '#ffffff',
  },
]

/**
 * ==================================表单校验========================================
 */
const validateForm = () => {
  if (!formData.value.transaction_status_id) {
    uni.showToast({
      title: '请选择成交状态',
      icon: 'none',
    })
    return false
  }
  if (!formData.value.agent_id) {
    uni.showToast({
      title: '请选择经纪人',
      icon: 'none',
    })
    return false
  }
  if (!formData.value.total_price) {
    uni.showToast({
      title: '请输入成交价格',
      icon: 'none',
    })
    return false
  }
  if (!formData.value.agency_fee) {
    uni.showToast({
      title: '请输入出房中介费',
      icon: 'none',
    })
    return false
  }
  if (!formData.value.award) {
    uni.showToast({
      title: '请输入出房成交奖',
      icon: 'none',
    })
    return false
  }
  if (!formData.value.mul_img || formData.value.mul_img.length === 0) {
    uni.showToast({
      title: '请上传成交合同',
      icon: 'none',
    })
    return false
  }
  return true
}

const handleButtonClick = (index: number) => {
  if (index === 0) {
    if (validateForm()) {
      submitReq()
    }
  }
}
const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
  .content {
    height: calc(100vh - env(safe-area-inset-bottom) - 220rpx);
    background: #fff;
  }
}
</style>
