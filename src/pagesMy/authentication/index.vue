<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="title"
      :showBack="true"
      class="navbar-fixed"
    />
    <view
      class="content"
      :class="{ 'has-bottom-btn': !isRegister }"
      :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }"
    >
      <AuthRegisterSection v-if="!isRegister" :type="type" @view-agreement="handleViewAgreement" />
      <!-- 已签约显示具体 -->
      <view v-else>
        <!-- 经纪人列表页 -->
        <view v-if="type === 'agent'" class="agent-list">
          <SearchBox v-model="searchKeyword" placeholder="搜索房源名称" @search="handleSearch" />
          <DateFilter
            v-model:start-date="dateRange.startDate"
            v-model:end-date="dateRange.endDate"
            @date-change="handleDateChange"
          />
          <AgentAuthList
            :list="agentList"
            :loading="listLoading"
            :has-more="hasMore"
            :refreshing="agentRefreshing"
            @item-click="handleItemClick"
            @load-more="handleAgentLoadMore"
            @refresh="handleAgentRefresh"
          />
        </view>
        <view v-else-if="type === 'staff'" class="staff-list">
          <ShCustomTabs v-model="staffTabValue" :tabs="staffTabs" @change="handleStaffTabChange" />
          <SearchBox
            :back-white="true"
            v-model="staffSearchKeyword"
            placeholder="搜索房源名称"
            @search="handleStaffSearch"
          />
          <ShDateFilter
            :showLabel="false"
            v-model:start-date="staffDateRange.startDate"
            v-model:end-date="staffDateRange.endDate"
            @before-open="handleStaffDateBeforeOpen"
            @date-change="handleStaffDateChange"
          />
          <ShFilterSelect
            ref="staffFilterSelectRef"
            v-model="staffFilters"
            :filters="staffFilterConfigs"
            @filterChange="handleStaffFilterChange"
          />
          <StaffAuthList
            :list="staffList"
            :loading="staffListLoading"
            :has-more="staffHasMore"
            :refreshing="staffRefreshing"
            :currentType="staffParams.type"
            @load-more="handleStaffLoadMore"
            @item-click="handleStaffItemClick"
            @action="handleStaffAction"
            @refresh="handleStaffRefresh"
          />
        </view>
        <view v-else class="content-list"> </view>
      </view>
    </view>

    <ShPopup
      ref="addFeePopup"
      :title="popupTitle"
      @cancel="handlePopupCancel"
      @confirm="handlePopupConfirm"
      :confirmText="'确定'"
    >
      <view class="content-popup">{{ popupContent }}</view>
      <!-- <ShCustomForm v-model="formData" :fields="fields" /> -->
    </ShPopup>

    <!-- 底部导航栏 -->

    <ShBottomTabbar v-if="isRegister && type !== 'agent'" />
  </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import SearchBox from './components/SearchBox.vue'
import DateFilter from './components/DateFilter.vue'
import AgentAuthList from './components/AgentAuthList.vue'
import StaffAuthList, {
  type StaffAuthItem,
  type ActionButton,
} from './components/StaffAuthList.vue'
import ShCustomTabs from '@/components/ShCustomTabs.vue'
import ShFilterSelect from '@/components/ShFilterSelect.vue'
import AuthRegisterSection from './components/AuthRegisterSection.vue'
import type { FilterConfig } from '@/types/filter'
import { getAgentHouseListAPI } from '@/pagesMy/services/agent'
import { getCommunityListAPI, getStaffListAPI } from '@/pagesMy/services/agent'
import type { CustomFormField } from '@/types/customFormField'
const { safeAreaInsets } = uni.getSystemInfoSync()
import ShPopup from '@/components/ShPopup.vue'
import { confirmOnShelfAPI } from '../services/staff'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

const isRegister = computed(() => {
  if (type.value === 'agent') {
    return userStore.userInfo?.is_agent === 1
  }
  if (type.value === 'staff') {
    return userStore.userInfo?.is_inuser === 1
  }
  return false
})

/**
 * ==========================================================================
 *                                 @经纪人相关
 * ==========================================================================
 */

/**
 * ==================================搜索条件相关========================================
 */
// 关键词
const searchKeyword = ref('')
// 日期范围
const dateRange = ref({
  startDate: '',
  endDate: '',
})

// 关键词触发方法
const handleSearch = (keyword: string) => {
  agentParams.value.keyword = keyword
  agentParams.value.page = 1
  getAgentHouseListReq()
}
// 时间触发方法
const handleDateChange = (startDate: string, endDate: string) => {
  agentParams.value.start_time = startDate
  agentParams.value.end_time = endDate
  agentParams.value.page = 1
  getAgentHouseListReq()
}

/**
 * ==================================请求相关========================================
 */

const agentParams = ref({
  keyword: '',
  start_time: '',
  end_time: '',
  page: 1,
  per_page: 10,
})
const getAgentHouseListReq = async () => {
  if (listLoading.value) return

  listLoading.value = true
  try {
    uni.showLoading({
      title: '加载中',
      mask: true,
    })
    const res = await getAgentHouseListAPI(agentParams.value)
    uni.hideLoading()
    if (res.code === 200 && res.data) {
      const { list: agentData, current_page, per_page } = res.data

      if (agentParams.value.page === 1) {
        agentList.value = agentData
      } else {
        agentList.value.push(...agentData)
      }

      hasMore.value = agentData.length >= per_page
      agentParams.value.page = current_page
    } else {
      uni.showToast({
        title: res.msg || '加载失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('加载经纪人列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    listLoading.value = false
  }
}

/**
 * ==========================================================================
 *                                 经纪人结束
 * ==========================================================================
 */

/**
 * ==========================================================================
 *                                 @内部员工开始
 * ==========================================================================
 */

/**
 * ==================================搜索条件相关========================================
 */

// 搜索
const staffSearchKeyword = ref('')
const handleStaffSearch = (keyword: string) => {
  console.log('员工搜索关键词:', keyword)
  staffParams.value.keyword = keyword
  staffParams.value.page = 1
  console.log('员工搜索请求参数:', staffParams.value)
  getStaffListReq()
}

// 日期筛选
const staffDateRange = ref({
  startDate: '',
  endDate: '',
})
// 日期变化操作
const handleStaffDateChange = (startDate: string, endDate: string) => {
  staffParams.value.start_time = startDate
  staffParams.value.end_time = endDate
  staffParams.value.page = 1
  getStaffListReq()
  console.log('员工日期范围请求参数:', staffParams.value)
}

// ShDateFilter 打开前，先关闭筛选弹窗
const staffFilterSelectRef = ref<InstanceType<typeof ShFilterSelect> | null>(null)
const handleStaffDateBeforeOpen = (_which: 'start' | 'end') => {
  staffFilterSelectRef.value?.close()
}

/**
 * ==================================请求相关========================================
 */

// 获取小区信息
const communityList = ref<any[]>([])
const getCommunityListReq = async () => {
  const res = await getCommunityListAPI()
  const candidates = res.data || []
  candidates.unshift({ title: '全部', id: '0' })
  communityList.value = candidates
}

const staffParams = ref({
  keyword: '',
  start_time: '',
  end_time: '',
  pharmacist_id: '', // 小区id
  next_type: '', // 房源状态
  type: '1',
  page: 1,
  per_page: 10,
})

//员工房源列表
// 列表数据
const staffList = ref<any[]>([])
const getStaffListReq = async () => {
  if (staffListLoading.value) return

  staffListLoading.value = true
  try {
    uni.showLoading({
      title: '加载中',
    })
    const res = await getStaffListAPI(staffParams.value)
    uni.hideLoading()
    console.log('员工房源列表===================:', res)

    if (res.code === 200 && res.data) {
      const { list: staffData, current_page, per_page } = res.data

      if (staffParams.value.page === 1) {
        staffList.value = staffData
      } else {
        staffList.value.push(...staffData)
      }

      staffHasMore.value = staffData.length >= per_page
      staffParams.value.page = current_page
    } else {
      uni.showToast({
        title: res.msg || '加载失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('加载员工房源列表失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    staffListLoading.value = false
  }
}

/**
 * ==================================筛选控制相关========================================
 */

//  弹窗筛选操作
const handleStaffFilterChange = () => {
  // console.log('员工过滤器变化:', filterIndex, value)
  if (staffFilters.value[0]) {
    staffParams.value.pharmacist_id = staffFilters.value[0].toString()
  }
  if (staffFilters.value[1]) {
    staffParams.value.next_type = staffFilters.value[1].toString()
  }

  staffParams.value.page = 1
  console.log('员工过滤器变化:', staffFilters.value)
  getStaffListReq()
}
// ===== 内部员工相关 =====
// Tab 配置
const staffTabs = ref<any[]>([
  { title: '待签约', id: 'pending', value: '1' },
  { title: '待上架', id: 'waiting', value: '2' },
  { title: '已上架', id: 'listed', value: '3' },
  { title: '已售完', id: 'sold', value: '4' },
  { title: '全部', id: 'all', value: '0' },
])
const staffTabValue = ref<string | number>('pending')

const handleStaffTabChange = (value: string | number) => {
  staffTabValue.value = value
  staffParams.value.type = value.toString()

  const map: Record<string, string> = {
    pending: '1',
    waiting: '2',
    listed: '3',
    sold: '4',
    all: '0',
  }
  staffParams.value.type = map[value as string]
  staffParams.value.page = 1
  getStaffListReq()
  staffFilters.value = {}
}

// 过滤器配置
const staffFilterConfigs = computed<FilterConfig[]>(() => {
  const tab = String(staffTabValue.value)
  const filters: FilterConfig[] = []

  // 小区：五个 tab 选项都显示
  filters.push({
    label: '小区',
    options: communityOptions.value,
  })

  // 房源状态：待上架 / 已上架 / 已售卖 / 全部 显示
  if (tab === 'waiting' || tab === 'listed' || tab === 'sold' || tab === 'all') {
    let statusOptions: { title: string; id: string | number }[] = []
    if (tab === 'waiting') {
      statusOptions = [
        { title: '全部', id: '0' },
        { title: '已到期', id: '1' },
        { title: '装修中', id: '2' },
        { title: '装修完成', id: '3' },
        { title: '装修交付', id: '4' },
        { title: '审核中', id: '5' },
        { title: '审核驳回', id: '6' },
      ]
    } else if (tab === 'listed') {
      statusOptions = [
        { title: '全部', id: '7' },
        { title: '危险池', id: '8' },
        { title: '上架', id: '9' },
        { title: '下架', id: '10' },
      ]
    } else if (tab === 'sold') {
      statusOptions = [
        { title: '全部', id: '11' },
        { title: '完结', id: '12' },
        { title: '放款', id: '13' },
        { title: '过户', id: '14' },
      ]
    } else if (tab === 'all') {
      statusOptions = [
        { title: '全部', id: '15' },
        { title: '待签约', id: '16' },
        { title: '已签约', id: '17' },
        { title: '上架房源', id: '18' },
        { title: '待上架', id: '19' },
        { title: '已下架', id: '20' },
        { title: '已售卖', id: '21' },
      ]
    }

    filters.push({
      label: '房源状态',
      options: statusOptions,
    })
  }

  // 手续状态：已售卖 / 全部 显示
  if (tab === 'sold' || tab === 'all') {
    filters.push({
      label: '手续状态',
      options: [
        { title: '全部', id: '0' },
        { title: '待签约', id: '1' },
        { title: '待上架', id: '2' },
        { title: '已上架', id: '3' },
        { title: '已售卖', id: '4' },
      ],
    })
  }

  return filters
})

/**
 * ==================================上架========================================
 */

const popupTitle = ref('上架审核')

// 弹窗取消
const handlePopupCancel = () => {
  console.log('取消上架')
}
const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)
const currentHouseListId = ref<number | string>('')
// 弹窗确认
const handlePopupConfirm = async () => {
  uni.showLoading({
    title: '申请中',
  })
  const res = await confirmOnShelfAPI(currentHouseListId.value)
  uni.hideLoading()
  if (res.code === 200) {
    uni.showToast({
      title: '申请成功',
      icon: 'none',
    })
    getStaffListReq()
  } else {
    uni.showToast({
      title: res.msg || '申请失败',
      icon: 'none',
    })
  }
  addFeePopup.value?.close()
}

const staffFilters = ref<Record<number, string | number>>({})

const communityOptions = computed(() => {
  return communityList.value
})

const handleBack = () => {
  uni.navigateBack()
}
const handleViewAgreement = () => {
  console.log('查看注册协议')
}
const type = ref('') //经纪人 agent  内部员工 staff，片区经理 manager，投资人 investment 房屋装修 renovation

// 列表相关
const agentList = ref<any>([])

const listLoading = ref(false)
const hasMore = ref(true)
const agentRefreshing = ref(false)

// 触底加载更多
const handleAgentLoadMore = () => {
  if (!hasMore.value || listLoading.value) return

  console.log('经纪人列表触底加载更多======')
  agentParams.value.page++
  getAgentHouseListReq()
}

// 下拉刷新
const handleAgentRefresh = async () => {
  agentRefreshing.value = true
  agentParams.value.page = 1
  await getAgentHouseListReq()
  agentRefreshing.value = false
}

const handleItemClick = (item: any) => {
  console.log('点击列表项11111111111111111:', item)
}

const staffListLoading = ref(false)
const staffHasMore = ref(true)
const staffRefreshing = ref(false)

const handleStaffLoadMore = () => {
  if (!staffHasMore.value || staffListLoading.value) return

  console.log('员工列表触底加载更多======')
  staffParams.value.page++
  getStaffListReq()
}

// 下拉刷新
const handleStaffRefresh = async () => {
  staffRefreshing.value = true
  staffParams.value.page = 1
  await getStaffListReq()
  staffRefreshing.value = false
}

const handleStaffItemClick = (item: StaffAuthItem) => {
  console.log('点击员工列表项:', item)
}

const handleStaffAction = (action: string, item: StaffAuthItem) => {
  console.log('员工操作11111111:', item)
  switch (action) {
    case 'view': //跟进记录
      uni.navigateTo({
        url: `/pagesMy/authentication/followRecord?house_list_id=${item.id}&title=${item.house_title}`,
      })
      break
    case 'sign': //签约信息
      uni.navigateTo({
        url: `/pagesMy/authentication/sign?house_list_id=${item.id}`,
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
        url: `/pagesMy/authentication/investor?house_list_id=${item.id}`,
      })

      break
    case 'decorate': //装修管理
      uni.navigateTo({
        url: `/pagesMy/authentication/renovation?house_list_id=${item.id}&user_id=${item.user_id}`,
      })
      break
    case 'deal': //成交信息
      uni.navigateTo({
        url: `/pagesMy/authentication/dealRecord?house_list_id=${item.id}`,
      })
      break
    case 'detail': //查看详情
      uni.navigateTo({
        url: `/pagesMy/authentication/detail?house_list_id=${item.id}`,
      })
      break
    case 'fee': //费用
      uni.navigateTo({
        url: `/pagesMy/authentication/fee?house_list_id=${item.id}`,
      })
      break
    case 'procedure': //手续管理
      uni.navigateTo({
        url: `/pagesMy/authentication/procedure?house_list_id=${item.id}`,
      })
      break

    case 'online': //上架
      currentHouseListId.value = item.id
      popupTitle.value = '上架审核'
      popupContent.value = '是否确定提交上架审核'
      addFeePopup.value?.open()

      break
    case 'offline': //下架
      currentHouseListId.value = item.id
      popupTitle.value = '下架审核'
      popupContent.value = '是否确定提交下架审核'
      addFeePopup.value?.open()
      break
    case 'add': //添加
      break
  }
}
const popupContent = ref('是否确定提交上架审核')
const title = ref('')
// 当前页面类型
onLoad((options) => {
  type.value = uni.getStorageSync('currentOtherManageType')
  console.log('type:', type.value)
  if (!isRegister.value) {
    title.value = '身份认证'
  } else if (type.value === 'agent') {
    title.value = '经纪人'
    getAgentHouseListReq()
  } else if (type.value === 'staff') {
    title.value = '内部员工'
    getCommunityListReq() //获取小区的数据
    getStaffListReq()
  }
})
</script>

<style lang="scss" scoped>
.content-popup {
  display: flex;
  justify-content: center;
  padding: 30rpx;
}
.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #999999;
  }
}
.container {
  padding-top: 20rpx;
  padding-bottom: 150rpx;
  background: #fff;
  min-height: 100vh;
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
  &.has-bottom-btn {
    padding-bottom: 280rpx;
  }
}

.agent-list,
.staff-list {
  display: flex;
  flex-direction: column;
}
</style>
