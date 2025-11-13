<script setup lang="ts">
import { ref } from 'vue'
const currentRole = uni.getStorageSync('currentOtherManageType')

interface FeeItem {
  created_at: string
  created_time: string
  expense_type_id: number
  expense_type_title: string //内部员工使用
  expense_type_name: string //片区经理使用
  price: string
  remark: string
  title: null
}

const props = defineProps({
  list: {
    type: Array as () => any[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits<{
  loadMore: []
  refresh: []
}>()

const scrollTop = ref(0)
const isLoadingMore = ref(false)
const isRefreshing = ref(false)

// 触底加载
const handleScrollToLower = () => {
  if (isLoadingMore.value || !props.hasMore || props.loading) {
    return
  }
  isLoadingMore.value = true
  emit('loadMore')
  setTimeout(() => {
    isLoadingMore.value = false
  }, 500)
}

// 下拉刷新
const handleRefresh = async () => {
  if (isRefreshing.value || props.loading) {
    return
  }
  isRefreshing.value = true
  emit('refresh')
  // 延迟重置状态，确保刷新操作完成
  setTimeout(() => {
    isRefreshing.value = false
  }, 1000)
}

// 格式化金额
const formatAmount = (amount: string) => {
  return `¥ ${amount}`
}
</script>

<template>
  <scroll-view
    class="fee-list"
    scroll-y
    :class="{ 'has-bottom-btn': currentRole === 'manager' }"
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
    refresher-enabled
    :refresher-triggered="isRefreshing"
    @refresherrefresh="handleRefresh"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.expense_type_id" class="fee-item">
        <!-- 标题和金额 -->
        <view class="fee-header">
          <text class="fee-title">{{ item.expense_type_title || item.expense_type_name }}</text>
          <text class="fee-amount">{{ formatAmount(item.price) }}</text>
        </view>

        <!-- 时间 -->
        <view class="fee-time">
          <text class="time-label">时间：</text>
          <text class="time-value">{{ item.created_time }}</text>
        </view>

        <!-- 备注 -->
        <view class="fee-remark">
          <text class="remark-label">备注：</text>
          <text class="remark-value">{{ item.remark }}</text>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading || isLoadingMore" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-else-if="!hasMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
        <view class="space" :style="{ height: '200rpx' }"></view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <text class="empty-text">暂无费用信息</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.fee-list {
  flex: 1;
  width: 100%;
  height: calc(100vh - env(safe-area-inset-bottom) - 400rpx);
  background: #f7f8fc;
}
.has-bottom-btn {
  height: calc(100vh - env(safe-area-inset-bottom) - 300rpx) !important;
}

.list-container {
  padding: 0rpx 30rpx;
}

.fee-item {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.fee-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1px solid #e8e4ed;
}

.fee-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 38rpx;
}

.fee-amount {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #f9432e;
  line-height: 42rpx;
}

// 时间
.fee-time {
  display: flex;
  align-items: center;
  margin-bottom: 15rpx;
}

.time-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 40rpx;
}

.time-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 40rpx;
}

.fee-remark {
  display: flex;
  align-items: flex-start;
}

.remark-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  line-height: 36rpx;
  flex-shrink: 0;
}

.remark-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  line-height: 36rpx;
  flex: 1;
  word-break: break-all;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.loading-text {
  font-size: 24rpx;
  color: #999;
}

.no-more {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-more-text {
  font-size: 24rpx;
  color: #bfbfbf;
  padding: 30rpx 0;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #bfbfbf;
}
</style>
