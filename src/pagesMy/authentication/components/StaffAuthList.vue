<script setup lang="ts">
import { ref } from 'vue'

export interface ActionButton {
  label: string
  action: string
}

export interface StaffAuthItem {
  id: string | number
  image: string
  title: string
  code: string // 编号
  district: string // 小区
  datetime: string // 时间
  status: string[] // 状态标签数组(待签约、签约等)
}

const props = defineProps({
  list: {
    type: Array as () => StaffAuthItem[],
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
  actions: {
    type: Array as () => ActionButton[],
    default: () => [],
  },
})

const emit = defineEmits<{
  loadMore: []
  itemClick: [item: StaffAuthItem]
  action: [action: string, item: StaffAuthItem]
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
const handleItemClick = (item: StaffAuthItem) => {
  emit('itemClick', item)
}

// 点击操作按钮
const handleAction = (action: string, item: StaffAuthItem, event: Event) => {
  event.stopPropagation()
  console.log('点击操作按钮:', action, item)
  emit('action', action, item)
}

// 获取状态颜色
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    待签约: '#3399FF',
    装修中: '#3399FF',
    已签约: '#00B050',
    签约到期: '#FF9900',
    装修完成: '#863FCE',
    审核驳回: '#FF0000',
    装修支付: '#00B050',
    上架审核: '#3399FF',
    已上架: '#00B050',
    已下架: '#999999',
    危险池: 'red',
    已售卖: '#00B050',
  }
  return colorMap[status] || '#3399FF'
}
</script>

<template>
  <scroll-view
    class="staff-auth-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="auth-item" @tap="handleItemClick(item)">
        <!-- 顶部时间和状态 -->
        <view class="item-header">
          <text class="item-datetime">{{ item.datetime }}</text>
          <view class="status-badges">
            <view
              v-for="(statusItem, statusIndex) in item.status"
              :key="statusIndex"
              class="status-badge"
            >
              <text class="status-text" :style="{ color: getStatusColor(statusItem) }">
                {{ statusItem }}
              </text>
            </view>
          </view>
        </view>

        <!-- 主体内容 -->
        <view class="item-main">
          <!-- 左侧图片 -->
          <image class="item-image" :src="item.image" mode="aspectFill"></image>

          <!-- 右侧信息 -->
          <view class="item-info">
            <!-- 标题 -->
            <text class="item-title">{{ item.title }}</text>

            <!-- 编号 -->
            <view class="item-detail">
              <text class="detail-label">编号：</text>
              <text class="detail-value">{{ item.code }}</text>
            </view>

            <!-- 小区 -->
            <view class="item-detail">
              <text class="detail-label">小区：</text>
              <text class="detail-value">{{ item.district }}</text>
            </view>
          </view>
        </view>

        <!-- 底部操作按钮 -->
        <view v-if="actions && actions.length > 0" class="item-actions">
          <view
            v-for="(btn, btnIndex) in actions"
            :key="btnIndex"
            class="action-button"
            @tap="handleAction(btn.action, item, $event)"
          >
            <text class="action-text">{{ btn.label }}</text>
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
        <text class="empty-text">暂无数据</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.staff-auth-list {
  height: calc(100vh - 400rpx);
  width: 100%;
  background: #f5f5f5;
}

.list-container {
  padding: 20rpx 32rpx;
}

.auth-item {
  margin-bottom: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 24rpx;

  &:active {
    opacity: 0.95;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.item-datetime {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #7b678f;
  line-height: 42rpx;
}

.status-badges {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
}

.status-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 42rpx;
}

.item-main {
  display: flex;
  gap: 22rpx;
  margin-bottom: 24rpx;
}

.item-image {
  width: 166rpx;
  height: 167rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16rpx;
  min-width: 0;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 36rpx;
}

.item-detail {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.detail-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #6a6a6a;
  line-height: 40rpx;
}

.detail-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #6a6a6a;
  line-height: 40rpx;
}

.item-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 16rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  background: #ffffff;
  border-radius: 30rpx;
  border: 2px solid #863fce;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }
}

.action-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 36rpx;
  color: #863fce;
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
