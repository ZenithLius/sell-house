<script setup lang="ts">
import { ref } from 'vue'

interface RecordItem {
  created_at: string
  created_time: string
  id: number
  mobile: string
  nickname: string
  user_id: number
}

const props = defineProps({
  list: {
    type: Array as () => RecordItem[],
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
  itemClick: [item: RecordItem]
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

// 点击记录项
const handleItemClick = (item: RecordItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <scroll-view
    class="record-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="record-item" @click="handleItemClick(item)">
        <!-- 左侧图标 -->
        <image class="record-icon" src="@/pagesMy/static/detailLeft.png" mode="aspectFit" />

        <!-- 内容区域 -->
        <view class="record-content">
          <!-- 时间 -->
          <text class="record-time">{{ item.created_time }}</text>

          <!-- 用户信息 -->
          <text class="record-user">{{ item.nickname }} - {{ item.mobile }}</text>
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
        <text class="empty-text">暂无记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.record-list {
  flex: 1;
  width: 100%;
  height: calc(100vh - env(safe-area-inset-bottom) - 350rpx);
  background: #fff;
}

.list-container {
  padding: 0 30rpx 30rpx 30rpx;
}

.record-item {
  display: flex;
  align-items: flex-start;
  padding: 30rpx 0;
}

.record-icon {
  width: 8rpx;
  height: 17rpx;
  margin-right: 20rpx;
  margin-top: 10rpx;
  flex-shrink: 0;
}

.record-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.record-time {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #666666;
  line-height: 38rpx;
  margin-bottom: 12rpx;
}

.record-user {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 38rpx;
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
