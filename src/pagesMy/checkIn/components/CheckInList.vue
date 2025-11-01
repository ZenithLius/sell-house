<template>
  <scroll-view
    class="checkin-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="checkin-item">
        <!-- 左侧内容 -->
        <view class="item-content">
          <text class="item-name">{{ item.name }}</text>
          <text class="item-time">{{ item.time }}</text>
        </view>

        <!-- 右侧图片 -->
        <view class="image-wrapper">
          <image class="checkin-image" :src="item.image" mode="aspectFill" />
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
        <text class="empty-text">暂无打卡记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface CheckInItem {
  id: string | number
  name: string // 员工姓名
  time: string // 打卡时间
  image: string // 打卡图片
}

const props = defineProps({
  list: {
    type: Array as () => CheckInItem[],
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
</script>

<style lang="scss" scoped>
.checkin-list {
  height: calc(100vh - 480rpx);
  width: 100%;
  background: #fff;
}

.list-container {
  padding: 0 45rpx;
}

.checkin-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

// 内容区域
.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  min-width: 0;
}

.item-name {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 32rpx;
  color: #3a363d;
  line-height: 42rpx;
}

.item-time {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #9fa1a3;
  line-height: 42rpx;
}

// 图片容器
.image-wrapper {
  width: 138rpx;
  height: 138rpx;
  border-radius: 14rpx;
  overflow: hidden;
  flex-shrink: 0;
  margin-left: 24rpx;
}

.checkin-image {
  width: 100%;
  height: 100%;
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
