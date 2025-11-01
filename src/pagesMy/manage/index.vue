<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'片区经理'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <view v-if="currentDisplay === 'list'" class="drawer-search">
        <ShSearchBar placeholder="搜索房源名称" background-color="#fff" />
      </view>
      <FilterSelect
        v-if="currentDisplay === 'list'"
        v-model="staffFilters"
        :filters="staffFilterConfigs"
        @close="handleStaffFilterClose"
      />
      <ShDateFilter
        v-if="currentDisplay === 'performance'"
        :showLabel="false"
        v-model:start-date="staffDateRange.startDate"
        v-model:end-date="staffDateRange.endDate"
        @date-change="handleStaffDateChange"
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
        title="上架审核"
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
import { onLoad } from '@dcloudio/uni-app'
import FilterSelect from './components/FilterSelect.vue'
import { ref } from 'vue'
import type { FilterConfig } from '@/types/filter'
import StaffAuthList from './components/StaffAuthList.vue'
import type { StaffAuthItem } from './types'
import ShPopup from '@/components/ShPopup.vue'
const staffFilters = ref<Record<number, string | number | Record<string, string | number>>>({})

const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)

import type { CustomFormField } from '@/types/customFormField'

// 日期筛选
const staffDateRange = ref({
  startDate: '',
  endDate: '',
})
const handleStaffDateChange = (startDate: string, endDate: string) => {
  console.log('员工日期范围:', startDate, endDate)
  // TODO: 执行日期筛选逻辑
}

const currentDisplay = ref<'list' | 'performance'>('list')

onLoad((options) => {
  if (options?.id) {
    currentDisplay.value = 'performance'
  }

  console.log('options=============', options)
})

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
      { label: '审核通过', value: 'approved' },
      { label: '审核驳回', value: 'rejected' },
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
])

// 过滤器配置
const staffFilterConfigs: FilterConfig[] = [
  {
    label: '下属员工',
    options: [
      { label: '天朗御湖', value: 'tianlang' },
      { label: '阳光花园', value: 'yangguang' },
      { label: '帮帮小区', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
    ],
  },
  {
    label: '房源状态',
    options: [
      { label: '在售', value: 'selling' },
      { label: '装修中', value: 'decorating' },
      { label: '已签约', value: 'signed' },
      { label: '已下架', value: 'off' },
    ],
  },
  {
    label: '审核状态',
    // 平铺模式 options 必须存在，分组模式下给空数组
    options: [],
    groups: [
      {
        title: '装修交付审核',
        key: 'delivery',
        options: [
          { label: '不限', value: 'all' },
          { label: '待审核', value: 'pending' },
          { label: '已通过', value: 'approved' },
          { label: '已拒绝', value: 'rejected' },
        ],
      },
      {
        title: '上架审核',
        key: 'listing',
        options: [
          { label: '不限', value: 'all' },
          { label: '待审核', value: 'pending' },
          { label: '已通过', value: 'approved' },
          { label: '已拒绝', value: 'rejected' },
        ],
      },
      {
        title: '成交审核',
        key: 'deal',
        options: [
          { label: '不限', value: 'all' },
          { label: '待审核', value: 'pending' },
          { label: '已通过', value: 'approved' },
          { label: '已拒绝', value: 'rejected' },
        ],
      },
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
