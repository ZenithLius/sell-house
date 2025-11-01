<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'售卖房源'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +50+ 'px' }">
      <ShSearchBar
        placeholder="搜索房源名称"
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
        @loadMore="handleLoadMore"
        @itemClick="handleItemClick"
      />

      <ShBottomTabbar />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SalesRecordList from './components/SalesRecordList.vue'

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
    // TODO: 替换为实际的API调用
    // const res = await api.getPerformanceList({
    //   page: currentPage.value,
    //   pageSize: pageSize.value,
    //   keyword: searchKeyword.value,
    //   startDate: staffDateRange.value.startDate,
    //   endDate: staffDateRange.value.endDate,
    // })

    // 模拟数据
    setTimeout(() => {
      const names = [
        '张三',
        '李四',
        '王五',
        '赵六',
        '钱七',
        '孙八',
        '周九',
        '吴十',
        '郑十一',
        '王十二',
      ]
      const mockData: PerformanceItem[] = Array.from({ length: 10 }, (_, i) => ({
        id: currentPage.value * 10 + i,
        name: names[i] || `员工${currentPage.value * 10 + i}`,
        salesCount: Math.floor(50 + Math.random() * 150),
        totalAmount: 100000 + Math.random() * 200000,
      }))

      if (currentPage.value === 1) {
        salesList.value = mockData
      } else {
        salesList.value.push(...mockData)
      }

      // 模拟没有更多数据
      if (currentPage.value >= 3) {
        hasMore.value = false
      }

      loading.value = false
    }, 500)
  } catch (error) {
    console.error('加载数据失败:', error)
    loading.value = false
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  }
}

onMounted(() => {
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
