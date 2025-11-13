<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'待审核'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +20+ 'px' }">
      <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />

      <view class="drawer-search">
        <ShSearchBar placeholder="搜索房源名称" background-color="#fff" />
      </view>
      <FilterSelect
        v-model="staffFilters"
        :filters="staffFilterConfigs"
        @close="handleStaffFilterClose"
      />

      <StaffAuthList
        :list="staffList"
        :loading="staffListLoading"
        :has-more="staffHasMore"
        :actions="currentStaffActions"
        @load-more="handleStaffLoadMore"
        @item-click="handleStaffItemClick"
        @action="handleStaffAction"
      />

      <ShPopup
        ref="addFeePopup"
        :title="popupTitle"
        @cancel="handlePopupCancel"
        @confirm="handlePopupConfirm"
      >
        <ShCustomForm v-model="formData" :fields="fields" />
      </ShPopup>
    </view>
    <ShBottomTabbar />
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import FilterSelect from '../manage/components/FilterSelect.vue'
import { ref } from 'vue'
import type { FilterConfig } from '@/types/filter'
import StaffAuthList from '../manage/components/StaffAuthList.vue'
import type { StaffAuthItem } from '../manage/types'
import ShPopup from '@/components/ShPopup.vue'
const staffFilters = ref<Record<number, string | number | Record<string, string | number>>>({})

const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)
const popupTitle = ref('上架审核')
// Tab 配置
const tabs = [
  { label: '待审核', value: 'notice', badge: false },
  { label: '已审核', value: 'good-news', badge: false },
  { label: '已驳回', value: 'study', badge: false },
]

const activeTab = ref('notice')

const handleTabChange = (value: string) => {
  console.log('当前选中的 tab:', value)
}

import type { CustomFormField } from '@/types/customFormField'
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

const handleBack = () => {
  uni.navigateBack()
}

const handleStaffFilterChange = (
  filterIndex: number,
  value: string | number | Record<string, string | number>,
) => {
  console.log('员工过滤器变化:', filterIndex, value)
}

const handleStaffFilterClose = () => {
  console.log('员工过滤器关闭', staffFilters.value)
}

const handleStaffAction = (action: string, item: StaffAuthItem) => {
  console.log('员工操作11111111:', action)
  switch (action) {
    case 'view': //跟进记录
      uni.navigateTo({
        url: '/pagesMy/authentication/followRecord',
      })
      break
    case 'sign':
      uni.navigateTo({
        url: '/pagesMy/authentication/sign',
      })
      break
    case 'edit':
      console.log('编辑')
      break
    case 'enable':
      console.log('卖用')
      break
    case 'investor': //投资人
      uni.navigateTo({
        url: '/pagesMy/authentication/investor',
      })

      break
    case 'decorate': //装修管理
      uni.navigateTo({
        url: '/pagesMy/authentication/renovation',
      })
      break
    case 'deal': //成交信息
      uni.navigateTo({
        url: '/pagesMy/authentication/dealRecord',
      })
      break
    case 'detail': //查看详情
      uni.navigateTo({
        url: '/pagesMy/authentication/detail',
      })
      break
    case 'fee': //费用
      uni.navigateTo({
        url: '/pagesMy/authentication/fee',
      })
      break
    case 'procedure': //手续管理
      uni.navigateTo({
        url: '/pagesMy/authentication/procedure',
      })
      break
    case 'on': //上架
      addFeePopup.value?.open()
      break
    case 'onAudit': //上架审核
      addFeePopup.value?.open()
      break
    case 'return': //回款记录
      uni.navigateTo({
        url: '/pagesMy/manage/returnRecord',
      })
      break
  }
}
// 列表数据
const staffList = ref<StaffAuthItem[]>([
  {
    id: 1,
    image: 'https://pcapi-xiaofangzi-front-devtest.itheima.net/miniapp/uploads/goods_preview_1.jpg',
    title: '封闭小区高档社区 简装 近公园 交通便利',
    code: '620038',
    district: '天朗御湖',
    datetime: '2025.09.04 10:00:00',
    status: ['待签约', '装修中'],
  },
])

const handleStaffItemClick = (item: StaffAuthItem) => {
  console.log('点击员工列表项:', item)
}

const staffListLoading = ref(false)
const staffHasMore = ref(true)

const handleStaffLoadMore = () => {
  console.log('员工列表触底加载更多')
  staffListLoading.value = true
  // TODO: 调用接口加载更多数据
  setTimeout(() => {
    staffListLoading.value = false
    // 模拟数据加载完毕
    // staffHasMore.value = false
  }, 1000)
}

const currentStaffActions = ref([
  { label: '跟进记录', action: 'view' },
  { label: '签约', action: 'sign' },
  { label: '编辑', action: 'edit' },
  { label: '费用', action: 'fee' },
  { label: '上架', action: 'on' },
  { label: '装修管理', action: 'decorate' },
  { label: '成交信息', action: 'deal' },
  { label: '手续管理', action: 'procedure' },
  { label: '回款记录', action: 'return' },
  { label: '上架审核', action: 'onAudit' },
])

// 过滤器配置
const staffFilterConfigs: FilterConfig[] = [
  {
    label: '下属员工',
    options: [
      { title: '天朗御湖', id: 'tianlang' },
      { title: '阳光花园', id: 'yangguang' },
      { title: '帮帮小区', id: 'bangbang' },
      { title: '地铁新城', id: 'ditie' },
    ],
  },
]
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #f5f5f5;
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
</style>
