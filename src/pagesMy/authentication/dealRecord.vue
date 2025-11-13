<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'成交信息'"
      :showBack="true"
      class="navbar-fixed"
    />
    <scroll-view
      class="content"
      :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }"
      scroll-y
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
      @scrolltolower="handleScrollToLower"
    >
      <DealRecordList
        :list="list"
        :loading="isLoading"
        :hasMore="hasMore"
        @itemClick="handleItemClick"
        @audit="handleAudit"
      />
    </scroll-view>

    <!-- <BottomTabbar /> -->
    <!-- <ShBottomTabbar /> -->
    <ShBottomBtns
      v-if="currentRole !== 'manager'"
      :buttons="bottomButtons"
      @click="handleButtonClick"
      :paddingBottom="20"
      :backgroundColor="'#ffffff'"
    />
    <ShPopup
      ref="addFeePopup"
      title="成交审核"
      @cancel="handlePopupCancel"
      @confirm="handlePopupConfirm"
    >
      <ShCustomForm v-model="formData" :fields="fields" />
    </ShPopup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DealRecordList from './components/DealRecordList.vue'
import ShPopup from '@/components/ShPopup.vue'
import type { CustomFormField } from '@/types/customFormField'
import ShBottomTabbar from '@/components/ShBottomTabbar.vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { dealRecordListAPI } from '../services/staff'
import { useScrollRefresh } from '@/composables/testUseScroller'
interface DealRecordItem {
  agency_fee: string
  agent_id: number
  agent_name: string
  award: string
  create_time: string
  created_at: string
  examine_at: null
  examine_time: string
  mul_img: string[]
  remark: string | null
  status: string
  total_price: string
  transaction_status_id: number
  transaction_status_name: string
}
const currentRole = uni.getStorageSync('currentOtherManageType')

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */
const houseListId = ref<string | number>('')
onLoad((options) => {
  houseListId.value = options?.house_list_id || ''
})
onShow(async () => {
  await refresh()
})

/**
 * ===================================获取成交列表=======================================
 */

// 定义数据获取函数
const fetchDealRecordData = async (page: number) => {
  uni.showLoading({
    title: '加载中',
  })
  const res = await dealRecordListAPI({
    house_list_id: houseListId.value,
    page,
    per_page: 10,
  })
  uni.hideLoading()
  if (res.code === 200) {
    const processedList = res.data.list.map((item: any) => ({
      ...item,
      mul_img: item.mul_img ? item.mul_img.split(',') : [],
    }))
    return processedList
  }
  return []
}

const { list, isLoading, hasMore, isTriggered, onRefresherrefresh, handleScrollToLower, refresh } =
  useScrollRefresh<DealRecordItem>({
    fetchData: fetchDealRecordData,
    pageSize: 10,
    immediate: false,
  })

// 弹窗引用
const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)

// 弹窗取消
const handlePopupCancel = () => {
  console.log('取消添加费用')
}

// 弹窗确认
const handlePopupConfirm = () => {
  console.log('确认添加费用')
  addFeePopup.value?.close()
}

const formData = ref({
  area: '',
  feeName: '',
  feeAmount: '',
  idCard: '',
})

const fields: CustomFormField[] = [
  {
    key: 'auditStatus',
    label: 'none',
    type: 'radio-group',
    options: [
      { title: '审核通过', id: 'approved' },
      { title: '审核驳回', id: 'rejected' },
    ],
  },
  {
    key: 'feeName',
    label: 'none',
    placeholder: '描述你的问题',
    type: 'textarea',
    visible: (form) => form.auditStatus === 'rejected',
  },
]

const bottomButtons = [
  {
    text: '新增成交',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    uni.navigateTo({
      url: `/pagesMy/authentication/addDeal?house_list_id=${houseListId.value}`,
    })
  }
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.navigateBack()
}

// 点击记录项
const handleItemClick = (item: any) => {
  console.log('点击了记录项:', item)
  // 可以在这里跳转到详情页等
}

// 处理审核
const handleAudit = (item: any) => {
  addFeePopup.value?.open()
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  height: 100vh;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}

.content {
  height: calc(100vh - env(safe-area-inset-bottom) - 100rpx);
  display: flex;
  flex-direction: column;
}
</style>
