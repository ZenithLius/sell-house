<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'收益明细'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <incomeList
        :list="withdrawList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMoreWithdrawRecords"
        @itemClick="handleRecordClick"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import incomeList from './components/incomeList.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}
// 点击记录项
const handleRecordClick = (item: WithdrawRecord) => {
  console.log('点击提现记录:', item)
  // TODO: 跳转到详情页面或弹出详情弹窗
}
const withdrawList = ref<WithdrawRecord[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 10
interface WithdrawRecord {
  id: string | number
  datetime: string
  amount: number
  remark: string
}

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
onLoad(() => {
  loadWithdrawRecords()
})
// 加载更多
const loadMoreWithdrawRecords = () => {
  if (!hasMore.value || loading.value) return
  currentPage.value++
  loadWithdrawRecords(true)
}
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
}
</style>
