<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'身份认证'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view
      class="content"
      :class="{ 'has-bottom-btn': !isRegister }"
      :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }"
    >
      <!-- 未签约显示表单 -->
      <ShCustomForm v-if="isRegister" v-model="formData" :fields="fields" />
      <!-- 提交 -->
      <SubmitSection
        v-if="isRegister"
        v-model:agreed-to-terms="agreedToTerms"
        @view-agreement="handleViewAgreement"
        @submit="handleSubmit"
      />
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
            @item-click="handleItemClick"
          />
        </view>
        <view v-else-if="type === 'staff'" class="staff-list">
          <ShCustomTabs v-model="staffTabValue" :tabs="staffTabs" @change="handleStaffTabChange" />
          <SearchBox
            v-model="staffSearchKeyword"
            placeholder="搜索房源名称"
            @search="handleStaffSearch"
          />
          <DateFilter
            v-model:start-date="staffDateRange.startDate"
            v-model:end-date="staffDateRange.endDate"
            @date-change="handleStaffDateChange"
          />
          <FilterSelect
            v-model="staffFilters"
            :filters="staffFilterConfigs"
            @filter-change="handleStaffFilterChange"
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
        </view>
        <view v-else class="content-list"> </view>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <BottomTabbar v-if="!isRegister && type !== 'agent'" />
  </view>
</template>
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed, watch } from 'vue'
import SearchBox from './components/SearchBox.vue'
import DateFilter from './components/DateFilter.vue'
import AgentAuthList from './components/AgentAuthList.vue'
import FilterSelect, { type FilterConfig } from './components/FilterSelect.vue'
import StaffAuthList, {
  type StaffAuthItem,
  type ActionButton,
} from './components/StaffAuthList.vue'
import ShCustomTabs from '@/components/ShCustomTabs.vue'
import BottomTabbar from './components/BottomTabbar.vue'
import SubmitSection from './components/SubmitSection.vue'
const { safeAreaInsets } = uni.getSystemInfoSync()
const isRegister = ref(false)
const agreedToTerms = ref(false)

const handleBack = () => {
  uni.navigateBack()
}

const handleViewAgreement = () => {
  console.log('查看注册协议')
  // TODO: 跳转到协议页面
  // uni.navigateTo({
  //   url: '/pages/agreement/index'
  // })
}

const handleSubmit = () => {
  if (!agreedToTerms.value) {
    uni.showToast({
      title: '请先同意注册协议',
      icon: 'none',
    })
    return
  }
  console.log('提交表单数据:', formData.value)
  // TODO: 提交表单逻辑
  uni.showToast({
    title: '提交成功',
    icon: 'success',
  })
}
const formData = ref({
  communityName: '',
  area: '',
  price: '',
  region: '',
  address: '',
  customerName: '',
  phone: '',
  verificationCode: '',
  company: '',
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
  options?: { label: string; value: any }[]
}
const fields = computed<CustomFormField[]>(() => {
  const baseFields: CustomFormField[] = [
    {
      key: 'communityName',
      label: '身份选择',
      type: 'select',
      placeholder: '请选择',
      options: [
        { label: '经纪人', value: '1' },
        { label: '内部员工', value: '2' },
        { label: '片区经理', value: '3' },
        { label: '投资人', value: '4' },
      ],
      required: true,
    },
    { key: 'customerName', label: '姓名', type: 'input', placeholder: '请输入', required: true },
    {
      key: 'phone',
      label: '手机号',
      type: 'input',
      placeholder: '请输入',
      inputType: 'number',
      required: true,
    },
    {
      key: 'verificationCode',
      label: '验证码',
      type: 'code',
      placeholder: '请输入',
      inputType: 'number',
      required: true,
    },
  ]

  // 经纪人
  if (type.value === 'agent') {
    baseFields.push({
      key: 'company',
      label: '中介公司',
      type: 'input',
      placeholder: '请输入',
      inputType: 'text',
      required: true,
    })
  }

  return baseFields
})
const type = ref('') //经纪人 agent  内部员工 staff，片区经理 manager，投资人 investment 房屋装修 renovation

// 搜索和筛选相关
const searchKeyword = ref('')
const dateRange = ref({
  startDate: '',
  endDate: '',
})

const handleSearch = (keyword: string) => {
  console.log('搜索关键词:', keyword)
  // TODO: 执行搜索逻辑
}

const handleDateChange = (startDate: string, endDate: string) => {
  console.log('日期范围:', startDate, endDate)
  // TODO: 执行日期筛选逻辑
}

// 列表相关
const agentList = ref([
  {
    id: 1,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_1.jpg',
    title: '封闭小区高档社区 简装 近公园 交通便利',
    layout: '2室2厅',
    area: '89',
    floor: '低楼层',
    district: '帮帮小区333333333333',
    price: 55.8,
    unitPrice: 7585,
    commission: '中介费1.5% + 5000.00',
    totalAmount: 886800.0,
    agentFee: 12345.0,
    dealBonus: 5000.0,
    datetime: '2025.09.04 10:00:00',
  },
  {
    id: 2,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_2.jpg',
    title: '豪华装修三居室 视野开阔 配套齐全',
    layout: '3室2厅',
    area: '128',
    floor: '高楼层',
    district: '阳光花园',
    price: 89.9,
    unitPrice: 7023,
    commission: '中介费1.5% + 5000.00',
    totalAmount: 1123500.0,
    agentFee: 16852.5,
    dealBonus: 5000.0,
    datetime: '2025.09.03 14:30:00',
  },
  {
    id: 3,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_3.jpg',
    title: '温馨小户型 地铁口 生活便利',
    layout: '1室1厅',
    area: '65',
    floor: '中楼层',
    district: '地铁新城',
    price: 42.5,
    unitPrice: 6538,
    commission: '中介费1.5% + 5000.00',
    totalAmount: 531250.0,
    agentFee: 7968.75,
    dealBonus: 5000.0,
    datetime: '2025.09.02 09:15:00',
  },
])

const listLoading = ref(false)
const hasMore = ref(true)

const handleLoadMore = () => {
  console.log('触底加载更多')
  listLoading.value = true
  setTimeout(() => {
    listLoading.value = false
    // hasMore.value = false
  }, 1000)
}

const handleItemClick = (item: any) => {
  console.log('点击列表项11111111111111111:', item)
}

// ===== 内部员工相关 =====
// Tab 配置
const staffTabs = [
  { label: '待签约', value: 'pending' },
  { label: '待上架', value: 'waiting' },
  { label: '已上架', value: 'listed' },
  { label: '已售完', value: 'sold' },
  { label: '全部', value: 'all' },
]
const staffTabValue = ref('pending')

const handleStaffTabChange = (value: string) => {
  console.log('员工Tab切换:', value)
  staffTabValue.value = value
  // TODO: 根据tab切换加载数据
}

// 根据当前tab获取操作按钮配置
const currentStaffActions = computed<ActionButton[]>(() => {
  switch (staffTabValue.value) {
    case 'pending': // 待签约
      return [
        { label: '跟进记录', action: 'view' },
        { label: '签约', action: 'sign' },
        { label: '编辑', action: 'edit' },
        { label: '费用', action: 'fee' },
      ]
    case 'waiting': // 待上架
      return [
        { label: '跟进记录', action: 'view' },
        { label: '上架', action: 'online' },
        { label: '装修管理', action: 'decorate' },
        { label: '编辑', action: 'edit' },
        { label: '投资人', action: 'investor' },
        { label: '签约信息', action: 'sign' },
        { label: '费用', action: 'fee' },
      ]
    case 'listed': // 已上架
      return [
        { label: '跟进记录', action: 'view' },
        { label: '下架', action: 'offline' },
        { label: '装修管理', action: 'decorate' },
        { label: '编辑', action: 'edit' },
        { label: '投资人', action: 'investor' },
        { label: '签约信息', action: 'sign' },
        { label: '成交信息', action: 'deal' },
        { label: '查看详情', action: 'detail' },
        { label: '费用', action: 'fee' },
      ]
    case 'sold': // 已售卖
      return [
        { label: '跟进记录', action: 'view' },
        { label: '下架', action: 'offline' },
        { label: '装修管理', action: 'decorate' },
        { label: '编辑', action: 'edit' },
        { label: '手续管理', action: 'procedure' },
        { label: '签约信息', action: 'sign' },
        { label: '成交信息', action: 'deal' },
        { label: '查看', action: 'detail' },
        { label: '费用', action: 'fee' },
      ]
    case 'all': // 全部
      return [
        { label: '查看详情', action: 'detail' },
        { label: '编辑', action: 'edit' },
      ]
    default:
      return []
  }
})

// 搜索
const staffSearchKeyword = ref('')
const handleStaffSearch = (keyword: string) => {
  console.log('员工搜索关键词:', keyword)
  // TODO: 执行搜索逻辑
}

// 日期筛选
const staffDateRange = ref({
  startDate: '',
  endDate: '',
})

const handleStaffDateChange = (startDate: string, endDate: string) => {
  console.log('员工日期范围:', startDate, endDate)
  // TODO: 执行日期筛选逻辑
}

// 过滤器配置
const staffFilterConfigs: FilterConfig[] = [
  {
    label: '小区',
    options: [
      { label: '天朗御湖', value: 'tianlang' },
      { label: '阳光花园', value: 'yangguang' },
      { label: '帮帮小区3333333333333', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '天朗御湖', value: 'tianlang' },
      { label: '阳光花园', value: 'yangguang' },
      { label: '帮帮小区3333333333333', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '天朗御湖', value: 'tianlang' },
      { label: '阳光花园', value: 'yangguang' },
      { label: '帮帮小区3333333333333', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '天朗御湖', value: 'tianlang' },
      { label: '阳光花园', value: 'yangguang' },
      { label: '帮帮小区3333333333333', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '帮帮小区3333333333333', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '天朗御湖', value: 'tianlang' },
      { label: '阳光花园', value: 'yangguang' },
      { label: '帮帮小区3333333333333', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
      { label: '地铁新城', value: 'ditie' },
    ],
  },
  {
    label: '小区2',
    options: [
      { label: '天朗御湖', value: 'tianlang' },
      { label: '阳光花园', value: 'yangguang' },
      { label: '帮帮小区', value: 'bangbang' },
      { label: '地铁新城', value: 'ditie' },
    ],
  },
]

const staffFilters = ref<Record<number, string | number>>({})

const handleStaffFilterChange = (filterIndex: number, value: string | number) => {
  console.log('员工过滤器变化:', filterIndex, value)
}

// 列表数据
const staffList = ref<StaffAuthItem[]>([
  {
    id: 1,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_1.jpg',
    title: '封闭小区高档社区 简装 近公园 交通便利',
    code: '620038',
    district: '天朗御湖',
    datetime: '2025.09.04 10:00:00',
    status: ['待签约', '装修中'],
  },
])

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

const handleStaffItemClick = (item: StaffAuthItem) => {
  console.log('点击员工列表项:', item)
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
  }
}

// type到身份选择value的映射
const typeToIdentityMap: Record<string, string> = {
  agent: '1', // 经纪人
  staff: '2', // 内部员工
  manager: '3', // 片区经理
  investment: '4', // 投资人
}

onLoad((options) => {
  type.value = options?.type || ''
  console.log('type:', type.value)
  if (type.value && typeToIdentityMap[type.value]) {
    formData.value.communityName = typeToIdentityMap[type.value]
  }
})
</script>

<style lang="scss" scoped>
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
