<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      :home="true"
      v-show="true"
      :title="'投资人'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <InvestorHeader
        :userName="'张三'"
        :totalRevenue="10000.0"
        :totalInvestment="5000.0"
        :balance="200.0"
        @detail="handleDetail"
      />
      <ShCustomTabs v-model="activeTab" :tabs="tabs" @change="handleTabChange" />

      <WithdrawRecordList
        v-if="activeTab === 'notice'"
        :list="withdrawList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMoreWithdrawRecords"
        @itemClick="handleRecordClick"
      />
      <view class="table-list" v-else-if="activeTab === 'good-news'">
        <ShLabelHomeList
          :list="staffList"
          :loading="staffListLoading"
          :has-more="staffHasMore"
          :actions="currentStaffActions"
          @load-more="handleStaffLoadMore"
          @item-click="handleStaffItemClick"
          @action="handleStaffAction"
        />
      </view>
    </view>
    <ShPopup
      ref="addFeePopup"
      title="上架审核"
      @cancel="handlePopupCancel"
      @confirm="handlePopupConfirm"
    >
      <ShCustomForm v-model="formData" :fields="fields" />
    </ShPopup>
  </view>
</template>

<script setup lang="ts">
import InvestorHeader from './components/InvestorHeader.vue'
import WithdrawRecordList from './components/WithdrawRecordList.vue'
import type { StaffAuthItem } from '@/components/ShLabelHomeList.vue'
import { ref, onMounted } from 'vue'
import ShPopup from '@/components/ShPopup.vue'
import type { CustomFormField } from '@/types/customFormField'
// ===================================================

const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)

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
// 模拟数据生成
const generateMockData = (startId: number, count: number): StaffAuthItem[] => {
  const titles = [
    '封闭小区高档社区 简装 近公园 交通便利',
    '精装修三居室 采光好 配套齐全',
    '学区房 地铁口 性价比高',
    '豪华装修 拎包入住 环境优美',
    '商业中心 投资首选 回报率高',
  ]
  const districts = ['天朗御湖', '绿地世纪城', '万科城', '保利公园', '恒大绿洲']
  const statusOptions = [
    ['待签约', '装修中'],
    ['已签约', '装修完成'],
    ['签约到期', '装修支付'],
    ['上架审核', '已上架'],
    ['已下架', '已售卖'],
  ]

  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    image: 'https://pcapi-xiaofangzi-front-devtest.itheima.net/miniapp/uploads/goods_preview_1.jpg',
    title: titles[i % titles.length],
    code: `62${String(startId + i).padStart(4, '0')}`,
    district: districts[i % districts.length],
    datetime: '2025.09.04 10:00:00',
    status: statusOptions[i % statusOptions.length],
  }))
}

const staffList = ref<StaffAuthItem[]>(generateMockData(1, 8))
const staffPageNum = ref(1)
const handleStaffItemClick = (item: StaffAuthItem) => {
  console.log('点击员工列表项:', item)
}
const staffListLoading = ref(false)
const staffHasMore = ref(true)
const handleStaffLoadMore = () => {
  if (staffListLoading.value || !staffHasMore.value) return

  staffListLoading.value = true

  // 模拟网络请求
  setTimeout(() => {
    staffPageNum.value++
    const startId = (staffPageNum.value - 1) * 5 + 1
    const newData = generateMockData(startId, 5)
    staffList.value = [...staffList.value, ...newData]

    // 模拟加载3页后没有更多数据
    if (staffPageNum.value >= 4) {
      staffHasMore.value = false
    }

    staffListLoading.value = false
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
// ================================================
interface WithdrawRecord {
  id: string | number
  datetime: string
  amount: number
  remark: string
}

// Tab 配置
const tabs = [
  { label: '提现记录', value: 'notice', badge: false },
  { label: '房源列表', value: 'good-news', badge: false },
]
const activeTab = ref('notice')
const handleTabChange = (value: string) => {
  console.log('当前选中的 tab:', value)
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.switchTab({ url: '/pages/index/index' })
}

const handleDetail = () => {
  // 跳转到收益明细页面
  console.log('查看收益明细')
}

// 提现记录相关
const withdrawList = ref<WithdrawRecord[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 10

// 加载提现记录
const loadWithdrawRecords = async (isLoadMore = false) => {
  if (loading.value) return

  loading.value = true
  try {
    // TODO: 替换为实际的 API 调用
    // const res = await getWithdrawRecordsAPI({ page: currentPage.value, pageSize })

    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    const mockData: WithdrawRecord[] = Array.from({ length: pageSize }, (_, i) => ({
      id: `${currentPage.value}-${i}`,
      datetime: '2025.09.04 10:00:00',
      amount: 10000.0,
      remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字',
    }))

    if (isLoadMore) {
      withdrawList.value = [...withdrawList.value, ...mockData]
    } else {
      withdrawList.value = mockData
    }

    // 模拟没有更多数据
    if (currentPage.value >= 3) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载提现记录失败:', error)
    uni.showToast({ title: '加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

// 加载更多
const loadMoreWithdrawRecords = () => {
  if (!hasMore.value || loading.value) return
  currentPage.value++
  loadWithdrawRecords(true)
}

// 点击记录项
const handleRecordClick = (item: WithdrawRecord) => {
  console.log('点击提现记录:', item)
  // TODO: 跳转到详情页面或弹出详情弹窗
}

// 页面加载时获取数据
onMounted(() => {
  loadWithdrawRecords()
})
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
  .table-list {
    padding-top: 20rpx;
  }
}
</style>
