<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'回款记录'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <ReturnRecordList
        :list="recordList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="handleLoadMore"
        @itemClick="handleItemClick"
      />
    </view>
    <ShBottomBtns :buttons="bottomButtons" @click="handleButtonClick" />
    <ShBottomTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReturnRecordList from './components/ReturnRecordList.vue'
import ShBottomTabbar from '@/components/ShBottomTabbar.vue'

const bottomButtons = [
  {
    text: '新增',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    uni.navigateTo({
      url: '/pagesMy/manage/addReturnRecord',
    })
  }
}

interface ReturnRecordItem {
  id: string | number
  status: string
  statusTime: string
  buyerName: string
  sellerName: string
  totalAmount: number
  houseTime: string
  returnTime: string
  actualHousePrice: number
  houseCommission: number
  houseBonus: number
  sellingPrice: number
  sellingCommission: number
  sellingBonus: number
  renovationCost: number
  waterElectricity: number
  salesFee: number
  otherFee: number
  profit: number
  note: string
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const recordList = ref<ReturnRecordItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 10

const handleBack = () => {
  uni.navigateBack()
}

// 加载数据
const loadData = async () => {
  if (loading.value) return

  loading.value = true
  try {
    // TODO: 替换为实际的API调用
    // const res = await fetchReturnRecords({ page: currentPage.value, pageSize })

    // 模拟数据
    const mockData: ReturnRecordItem[] = Array.from({ length: pageSize }, (_, index) => ({
      id: (currentPage.value - 1) * pageSize + index + 1,
      status: '天朗御湖',
      statusTime: '2025.09.04 10:00:00',
      buyerName: '张三',
      sellerName: '李四',
      totalAmount: 1233432323.0,
      houseTime: '2025.09.01 10:00:00',
      returnTime: '2025.09.01 10:00:00',
      actualHousePrice: 1236.0,
      houseCommission: 1022.0,
      houseBonus: 1333.0,
      sellingPrice: 16.0,
      sellingCommission: 102.0,
      sellingBonus: 123.0,
      renovationCost: 1233.0,
      waterElectricity: 1233.0,
      salesFee: 133.0,
      otherFee: 1333.0,
      profit: 113.0,
      note: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
    }))

    if (currentPage.value === 1) {
      recordList.value = mockData
    } else {
      recordList.value.push(...mockData)
    }

    // 模拟没有更多数据
    if (currentPage.value >= 3) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 加载更多
const handleLoadMore = () => {
  if (!hasMore.value || loading.value) return
  currentPage.value++
  loadData()
}

// 点击列表项
const handleItemClick = (item: ReturnRecordItem) => {
  console.log('点击了列表项:', item)
  // TODO: 跳转到详情页
  // uni.navigateTo({
  //   url: `/pagesMy/manage/returnRecordDetail?id=${item.id}`
  // })
}

// 初始化加载
loadData()
</script>

<style lang="scss" scoped>
.container {
  background: #f5f5f5;
  min-height: 100vh;

  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }

  .content {
    width: 100%;
  }
}
</style>
