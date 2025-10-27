<script setup lang="ts">
import { ref } from 'vue'

interface HouseItem {
  id: string | number
  title: string
  price: string
  area: string // 区域
  size: string // 面积
  address: string // 地址
  date: string // 日期
}

const props = defineProps({
  list: {
    type: Array as () => HouseItem[],
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
  itemClick: [item: HouseItem]
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
const handleItemClick = (item: HouseItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <scroll-view
    class="house-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="house-item" @tap="handleItemClick(item)">
        <!-- 标题和价格 -->
        <view class="item-header">
          <text class="item-title">{{ item.title }}</text>
          <text class="item-price">{{ item.price }}</text>
        </view>

        <!-- 详细信息 -->
        <view class="item-details">
          <view class="detail-row">
            <text class="detail-label">区域：</text>
            <text class="detail-value">{{ item.area }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">面积：</text>
            <text class="detail-value">{{ item.size }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">地址：</text>
            <text class="detail-value">{{ item.address }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">日期：</text>
            <text class="detail-value">{{ item.date }}</text>
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
        <view class="space" :style="{ height: '200rpx' }"></view>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <text class="empty-text">暂无卖房记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.house-list {
  height: calc(100vh - 300rpx);
  width: 100%;
  background: #f5f5f5;
}

.list-container {
  padding: 29rpx 30rpx;
}

.house-item {
  margin-bottom: 24rpx;
  padding: 39rpx 15rpx 39rpx 15rpx;
  background: #ffffff;
  border-radius: 20rpx;
}

// 标题和价格
.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 24rpx;
  border-bottom: 1px solid #e8e4ed;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 30rpx;
  color: #030509;
  line-height: 38rpx;
}

.item-price {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #f9432e;
  line-height: 42rpx;
  margin-left: 20rpx;
}

// 详细信息
.item-details {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 20rpx;
}

.detail-row {
  display: flex;
  align-items: center;
  line-height: 40rpx;
}

.detail-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #999999;
  flex-shrink: 0;
}

.detail-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
