<script setup lang="ts">
import { ref } from 'vue'

interface ProcedureItem {
  id: string | number
  status: string // 状态：完结、放款、过户等
  time: string // 时间
  remark: string // 备注
}

const props = defineProps({
  list: {
    type: Array as () => ProcedureItem[],
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
  itemClick: [item: ProcedureItem]
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
const handleItemClick = (item: ProcedureItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <scroll-view
    class="procedure-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view
        v-for="item in list"
        :key="item.id"
        class="procedure-item"
        @click="handleItemClick(item)"
      >
        <!-- 状态标题 -->
        <view class="procedure-header">
          <text class="status-label">状态：</text>
          <text class="status-value">{{ item.status }}</text>
        </view>

        <!-- 详情信息 -->
        <view class="procedure-content">
          <!-- 时间 -->
          <view class="info-row">
            <text class="info-label">时间：</text>
            <text class="info-value">{{ item.time }}</text>
          </view>

          <!-- 备注 -->
          <view class="info-row">
            <text class="info-label">备注：</text>
            <text class="info-value remark-text">{{ item.remark }}</text>
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
        <text class="empty-text">暂无手续记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.procedure-list {
  flex: 1;
  width: 100%;
  height: calc(100vh - env(safe-area-inset-bottom) - 400rpx);
  background: #fff;
}

.list-container {
  padding: 0 30rpx 30rpx 30rpx;
}

.procedure-item {
  background: #f9f9f9;
  border-radius: 16rpx;
  margin-bottom: 30rpx;
  padding: 30rpx;
  overflow: hidden;
}

.procedure-header {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 38rpx;
  border-bottom: 1px solid #e8e4ed;
  padding-bottom: 20rpx;
}

.status-label {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 32rpx;
  color: #333333;
  line-height: 48rpx;
}

.status-value {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 32rpx;
  color: #333333;
  line-height: 48rpx;
}

.procedure-content {
  padding-top: 10rpx;
}

.info-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.info-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 40rpx;
  flex-shrink: 0;
}

.info-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 40rpx;
  margin-left: 10rpx;
  flex: 1;
}

.remark-text {
  word-wrap: break-word;
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
