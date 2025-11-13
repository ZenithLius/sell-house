<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'员工业绩'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +50+ 'px' }">
      <ShSearchBar
        placeholder="搜索员工姓名"
        background-color="#fff"
        v-model="searchKeyword"
        @search="handleSearch"
      />

      <ShDateFilter
        :showLabel="false"
        v-model:start-date="staffDateRange.startDate"
        v-model:end-date="staffDateRange.endDate"
        @date-change="handleStaffDateChange"
      />

      <SalesRecordList
        :list="salesList"
        :loading="loading"
        :hasMore="hasMore"
        :refreshing="refreshing"
        @loadMore="handleLoadMore"
        @refresh="handleRefresh"
        @itemClick="handleItemClick"
      />

      <ShBottomTabbar />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SalesRecordList from './components/SalesRecordList.vue'
import { getPerformanceListAPI } from '../services/manage'
import { onLoad } from '@dcloudio/uni-app'

interface PerformanceItem {
  id: string | number
  name: string // 姓名
  salesCount: number // 售卖房源数量
  totalAmount: number // 业绩总额
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.navigateBack()
}

// 搜索关键词
const searchKeyword = ref('')

// 日期筛选
const staffDateRange = ref({
  startDate: '',
  endDate: '',
})

// 列表数据
const salesList = ref<PerformanceItem[]>([])
const loading = ref(false)
const refreshing = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(10)

// 搜索
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
  currentPage.value = 1
  salesList.value = []
  loadData()
}

// 日期筛选
const handleStaffDateChange = (startDate: string, endDate: string) => {
  console.log('日期范围:', startDate, endDate)

  currentPage.value = 1
  salesList.value = []
  loadData()
}

// 下拉刷新
const handleRefresh = async () => {
  refreshing.value = true
  currentPage.value = 1
  salesList.value = []
  hasMore.value = true
  await loadData()
  refreshing.value = false
}

// 加载更多
const handleLoadMore = () => {
  if (!hasMore.value || loading.value) return
  currentPage.value++
  loadData()
}

// 点击列表项
const handleItemClick = (item: PerformanceItem) => {
  console.log('点击员工业绩:', item)
  uni.navigateTo({
    url: `/pagesMy/manage/index?id=${item.id}`,
  })
}

// 加载数据
const loadData = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const params = {
      start_time: staffDateRange.value.startDate,
      end_time: staffDateRange.value.endDate,
      keyword: searchKeyword.value,
      page: currentPage.value,
      page_size: pageSize.value,
    }
    const res = await getPerformanceListAPI(params)
    console.log('员工业绩列表数据=================', res)

    if (res.code === 200) {
      const newData = res.data.list as any

      // 第一页替换数据，其他页拼接数据
      if (currentPage.value === 1) {
        salesList.value = newData
      } else {
        salesList.value.push(...newData)
      }

      // 判断是否还有更多数据
      hasMore.value = newData.length >= pageSize.value
    } else {
      uni.showToast({
        title: res.msg || '加载失败',
        icon: 'none',
      })
    }

    loading.value = false
  } catch (error) {
    console.error('加载数据失败:', error)
    loading.value = false
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

onLoad(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
.container {
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

  .content {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
}
</style>
