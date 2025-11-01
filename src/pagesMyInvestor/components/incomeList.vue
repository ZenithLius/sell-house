<script setup lang="ts">
import { ref } from 'vue'

interface WithdrawRecord {
  id: string | number
  datetime: string // 日期时间
  amount: number // 金额
  remark: string // 备注
}

const props = defineProps({
  list: {
    type: Array as () => WithdrawRecord[],
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
  itemClick: [item: WithdrawRecord]
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
const handleItemClick = (item: WithdrawRecord) => {
  emit('itemClick', item)
}

// 格式化金额
const formatAmount = (amount: number) => {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
</script>

<template>
  <scroll-view
    class="withdraw-record-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="record-item" @tap="handleItemClick(item)">
        <view class="item-marker"></view>
        <view class="item-content">
          <view class="item-remark">
            <text class="remark-label"></text>
            <text class="remark-text">{{ item.remark }}</text>
          </view>
          <view class="item-header">
            <text class="item-datetime">{{ item.datetime }}</text>
            <text class="item-amount">{{ formatAmount(item.amount) }}</text>
          </view>
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
        <text class="empty-text">暂无提现记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.withdraw-record-list {
  height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 180rpx);
  // padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
  background: #ffffff;
}

.list-container {
  padding: 24rpx 32rpx;
}

.record-item {
  display: flex;
  margin-bottom: 32rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  position: relative;
  border-bottom: 1rpx solid #f3f3f3;

  &:active {
    opacity: 0.95;
  }
}

.item-marker {
  width: 8rpx;
  height: 17rpx;
  background: #8b5cf6;
  border-radius: 3rpx;
  position: absolute;
  left: 24rpx;
  top: 45rpx;
  bottom: 0;
}

.item-content {
  flex: 1;
  margin-left: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-datetime {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  line-height: 38rpx;
}

.item-amount {
  font-family: Arial;
  font-weight: 400;
  font-size: 28rpx;
  color: #863fce;
  line-height: 38rpx;
}

.item-remark {
  display: flex;
  flex-direction: row;
}

.remark-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 40rpx;
}

.remark-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #000000;
  line-height: 42rpx;
  flex: 1;
  word-wrap: break-word;
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
