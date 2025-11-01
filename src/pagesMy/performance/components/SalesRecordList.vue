<script setup lang="ts">
import { ref } from 'vue'

interface PerformanceItem {
  id: string | number
  name: string // 姓名
  salesCount: number // 售卖房源数量
  totalAmount: number // 业绩总额
}

const props = defineProps({
  list: {
    type: Array as () => PerformanceItem[],
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
  itemClick: [item: PerformanceItem]
}>()

const scrollTop = ref(0)
const isLoadingMore = ref(false)

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

// 点击列表项
const handleItemClick = (item: PerformanceItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <scroll-view
    class="performance-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view
        v-for="item in list"
        :key="item.id"
        class="performance-item"
        @tap="handleItemClick(item)"
      >
        <view class="item-left">
          <!-- 姓名 -->
          <view class="name">{{ item.name }}</view>

          <!-- 售卖房源数量 -->
          <view class="sales-info" @tap="handleItemClick(item)">
            <image class="icon" src="@/pagesMy/static/sell.png" mode="aspectFit" />
            <text class="text">售卖房源数量：{{ item.salesCount }}套</text>
            <image class="icon-right" src="@/pagesMy/static/right.png" mode="aspectFit" />
          </view>
        </view>

        <view class="item-right">
          <view class="amount-label">业绩总额</view>
          <view class="amount-value">¥ {{ item.totalAmount.toFixed(2) }}</view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading || isLoadingMore" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-else-if="!hasMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.performance-list {
  height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 480rpx);
  width: 100%;
  background: #f5f5f5;
}
.icon-right {
  width: 30rpx;
  height: 30rpx;
}

.list-container {
  padding: 20rpx 30rpx;
}

.performance-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx 16rpx 30rpx 18rpx;
  flex-direction: column;
}

.item-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  border-bottom: 1px solid #f3f3f3;
  padding-bottom: 34rpx;
}

.name {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 30rpx;
  color: #000000;
  line-height: 42rpx;
}

.sales-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.icon {
  width: 32rpx;
  height: 32rpx;
  flex-shrink: 0;
}

.text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #404040;
  line-height: 42rpx;
}

.item-right {
  display: flex;
  align-items: center;
  padding-top: 25rpx;
  justify-content: flex-end;
}

.amount-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #030509;
  line-height: 42rpx;
}

.amount-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 30rpx;
  color: #f9432e;
  line-height: 42rpx;
  margin-left: 15rpx;
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
  justify-content: center;
  padding: 30rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #bfbfbf;
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
