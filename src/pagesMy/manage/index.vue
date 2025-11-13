<template>
  <view class="container" :style="{ background: isRegister ? '#f5f5f5' : '#ffffff' }">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="isRegister ? '片区经理' : '身份认证'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <AuthRegisterSection v-if="!isRegister" :type="type" @view-agreement="handleViewAgreement" />

      <view v-if="currentDisplay === 'list' && isRegister" class="drawer-search">
        <ShSearchBar
          @clickButton="handleClickButton"
          placeholder="搜索房源名称"
          background-color="#fff"
        />
      </view>
      <ShFilterSelect
        v-if="currentDisplay === 'list' && isRegister"
        v-model="staffFilters"
        :filters="staffFilterConfigs"
        @close="handleStaffFilterClose"
        ref="filterSelectRef"
      />
      <ShDateFilter
        v-if="currentDisplay === 'performance' && isRegister"
        :showLabel="false"
        v-model:start-date="staffDateRange.startDate"
        v-model:end-date="staffDateRange.endDate"
        @date-change="handleStaffDateChange"
      />

      <StaffAuthList
        v-if="isRegister"
        :height-offset="500"
        :list="staffList"
        :loading="staffListLoading"
        :has-more="staffHasMore"
        :refreshing="staffRefreshing"
        @load-more="handleStaffLoadMore"
        @item-click="handleStaffItemClick"
        @action="handleStaffAction"
        @refresh="handleStaffRefresh"
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
    <ShBottomTabbar v-if="isRegister" />
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import { onLoad } from '@dcloudio/uni-app'
import FilterSelect from './components/FilterSelect.vue'
import { computed, ref } from 'vue'
import type { FilterConfig } from '@/types/filter'
import StaffAuthList from '../authentication/components/StaffAuthList.vue'
import type { StaffAuthItem } from './types'
import ShPopup from '@/components/ShPopup.vue'
import { getShelfExamineAPI } from '../services/manage'

import AuthRegisterSection from '@/pagesMy/authentication/components/AuthRegisterSection.vue'
// 定义过滤器值的类型
const staffFilters = ref<any>({})

const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)

import type { CustomFormField } from '@/types/customFormField'
import { getHouseListAPI, getStaffListAPI } from '../services/manage'

/**
 * ==========================================================================
 *                                 @认证相关
 * ==========================================================================
 */
import { useUserStore } from '@/stores'
const userStore = useUserStore()

const isRegister = computed(() => {
  return userStore.userInfo?.is_district_manager === 1
})

const type = ref('manager')

const handleViewAgreement = () => {
  console.log('查看协议')
}

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

const houseParams = ref({
  keyword: '',
  type: '',
  start_time: '',
  end_time: '',
  next_user_id: '',
  next_type: '',
  put_type: '',
  sale_type: '',
  page: 1,
  per_page: 10,
})

const keyword = ref('')

const filterSelectRef = ref<InstanceType<typeof FilterSelect> | null>(null)
const handleClickButton = (value: string) => {
  keyword.value = value
  houseParams.value.keyword = value
  houseParams.value.page = 1
  getHouseListReq()
  filterSelectRef.value?.close()
}

/**
 * ==================================获取下属员工========================================
 */
const getStaffListReq = async () => {
  const res = await getStaffListAPI({ keyword: '', page: 1, per_page: 1000 })
  const target = staffFilterConfigs.value.find((f) => f.label === '下属员工')
  if (target) {
    target.options = res.data.list.map((item: any) => ({
      id: item.id,
      title: `${item.nickname}-${item.mobile}`,
    }))
  }
  if (res.code === 200) {
    staffList.value = res.data as any
  }
}

/**
 * ==================================获取房源列表========================================
 */

// staffFilters.value
// 房源列表
const getHouseListReq = async () => {
  if (staffListLoading.value) return

  const filter2 = staffFilters.value[2]
  const filter0 = staffFilters.value[0]
  const filter1 = staffFilters.value[1]

  houseParams.value.keyword = keyword.value
  houseParams.value.type =
    (typeof filter2 === 'object' && filter2 !== null && 'type' in filter2 ? filter2.type : '') || ''
  houseParams.value.next_user_id = (filter0 !== null ? filter0 : '') || ''
  houseParams.value.next_type = (filter1 !== null ? filter1 : '') || ''
  houseParams.value.put_type =
    (typeof filter2 === 'object' && filter2 !== null && 'put_type' in filter2
      ? filter2.put_type
      : '') || ''
  houseParams.value.sale_type =
    (typeof filter2 === 'object' && filter2 !== null && 'sale_type' in filter2
      ? filter2.sale_type
      : '') || ''

  staffListLoading.value = true
  try {
    uni.showLoading({
      title: '加载中',
    })
    const res = await getHouseListAPI(houseParams.value)
    uni.hideLoading()

    if (res.code === 200 && res.data) {
      const { list: houseData, current_page, per_page } = res.data

      if (houseParams.value.page === 1) {
        staffList.value = houseData
      } else {
        staffList.value.push(...houseData)
      }

      staffHasMore.value = houseData.length >= per_page
      houseParams.value.page = current_page
    } else {
      uni.showToast({
        title: res.msg || '加载失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('加载房源列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    staffListLoading.value = false
  }
}

/**
 * ==================================上架审核========================================
 */

const shelfExamineReq = async () => {
  const res = await getShelfExamineAPI({
    id: currentSelect.value.audit_record_id, //审核列表返回的id，正常房源列表返回的audit_record_id
    status: formData.value.auditStatus === 'approved' ? 1 : 2, //TODO
    remark: formData.value.remark,
    house_list_id: currentSelect.value.id,
    originally_id: currentSelect.value.originally_id,
    type: 1, // 固定是1
  })
}

// 弹窗取消
const handlePopupCancel = () => {
  console.log('取消添加费用')
}
// 弹窗确认
const handlePopupConfirm = () => {
  addFeePopup.value?.close()
}

// 日期筛选
const staffDateRange = ref({
  startDate: '',
  endDate: '',
})
const handleStaffDateChange = (startDate: string, endDate: string) => {
  console.log('员工日期范围:', startDate, endDate)
}

const currentDisplay = ref<'list' | 'performance'>('list')

onLoad((options) => {
  if (options?.id) {
    currentDisplay.value = 'performance'
  }
  // 获取下属员工
  getStaffListReq()
  // 房源列表
  getHouseListReq()
})

const formData = ref({
  auditStatus: '',
  remark: '',
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
    key: 'remark',
    label: 'none',
    placeholder: '描述你的问题',
    type: 'textarea',
    visible: (form) => form.auditStatus === 'rejected',
  },
]

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
  houseParams.value.page = 1
  getHouseListReq()
}

const currentSelect = ref<any>({})

const handleStaffAction = (action: any, item: any) => {
  console.log('员工操作11111111:', action)
  currentSelect.value = item
  switch (action) {
    case 'view': //跟进记录
      uni.navigateTo({
        url: `/pagesMy/authentication/followRecord?house_list_id=${item.id}&title=${item.house_title}`,
      })
      break
    case 'sign':
      uni.navigateTo({
        url: '/pagesMy/authentication/sign?house_list_id=${item.id}',
      })
      break
    case 'edit':
      console.log('编辑')
      uni.navigateTo({
        url: `/pagesMy/siteInspection/index?house_list_id=${item.id}`,
      })
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
        url: `/pagesMy/authentication/fee?house_list_id=${item.id}`,
      })
      break
    case 'procedure': //手续管理
      uni.navigateTo({
        url: '/pagesMy/authentication/procedure',
      })
      break
    case 'online': //上架
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
const staffList = ref<StaffAuthItem[]>([])

const handleStaffItemClick = (item: any) => {
  console.log('点击员工列表项:', item)
}

const staffListLoading = ref(false)
const staffHasMore = ref(true)
const staffRefreshing = ref(false)

const handleStaffLoadMore = () => {
  if (!staffHasMore.value || staffListLoading.value) return

  console.log('员工列表触底加载更多======')
  houseParams.value.page++
  getHouseListReq()
}

// 下拉刷新
const handleStaffRefresh = async () => {
  staffRefreshing.value = true
  houseParams.value.page = 1
  await getHouseListReq()
  staffRefreshing.value = false
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
const staffFilterConfigs = ref<any[]>([
  {
    label: '下属员工',
    options: [],
  },
  {
    label: '房源状态',
    options: [
      { title: '全部', id: '0' },
      { title: '待签约', id: '16' },
      { title: '已签约', id: '17' },
      { title: '已到期', id: '1' },
      { title: '装修中', id: '2' },

      { title: '装修完成', id: '3' },
      { title: '已售卖', id: '21' },
      { title: '已上架', id: '18' },
      { title: '未上架', id: '19' },
      { title: '危险池', id: '8' },
    ],
  },
  {
    label: '审核状态',
    options: [], //不能丢失
    groups: [
      {
        title: '装修交付审核',
        key: 'type',
        options: [
          { title: '全部', id: '0' },
          { title: '待审核', id: '1' },
          { title: '已审核', id: '2' },
          { title: '已驳回', id: '3' },
        ],
      },
      {
        title: '上架审核',
        key: 'put_type',
        options: [
          { title: '全部', id: '0' },
          { title: '待审核', id: '1' },
          { title: '已审核', id: '2' },
          { title: '已驳回', id: '3' },
        ],
      },
      {
        title: '成交审核',
        key: 'sale_type',
        options: [
          { title: '全部', id: '0' },
          { title: '待审核', id: '1' },
          { title: '已审核', id: '2' },
          { title: '已驳回', id: '3' },
        ],
      },
    ],
  },
])
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
