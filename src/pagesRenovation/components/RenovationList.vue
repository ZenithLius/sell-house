<script setup lang="ts">
import { ref } from 'vue'

export interface AuditProgress {
  name: string // 审核名称，如：完工审核
  status: string // 审核状态，如：审核驳回
  datetime: string // 审核时间
  auditor: string // 审核人
  remark?: string // 备注说明
}

export interface RenovationItem {
  id: string | number
  datetime: string // 日期时间
  status: string // 状态：墙面翻修 已完成
  isCompleted?: boolean // 是否已完工（用于显示绿色字体）
  title: string // 标题：小区名称
  tags: string[] // 标签：简装、近公园、交通便利
  address: string // 地址
  roomNumber: string // 房间号
  worker: string // 负责人
  workerPhone: string // 负责人电话
  auditProgress?: AuditProgress[] // 审核进度数组（可选，有数据才显示）
}

export interface ActionButton {
  key: string // 按钮唯一标识
  label: string // 按钮文字
  visible?: boolean // 是否显示，默认true
}

const props = defineProps({
  list: {
    type: Array as () => RenovationItem[],
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
  // 操作按钮配置
  actionButtons: {
    type: Array as () => ActionButton[],
    default: () => [
      { key: 'taskManage', label: '任务管理' },
      { key: 'renovationRecord', label: '装修记录' },
      { key: 'reportComplete', label: '上报完工' },
    ],
  },
})

const emit = defineEmits<{
  loadMore: []
  buttonClick: [key: string, item: RenovationItem]
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

// 按钮点击
const handleButtonClick = (key: string, item: RenovationItem) => {
  emit('buttonClick', key, item)
}

// 获取可见的按钮
const getVisibleButtons = () => {
  return props.actionButtons.filter((btn) => btn.visible !== false)
}

// 获取审核状态样式类
const getStatusClass = (status: string) => {
  if (status.includes('驳回')) {
    return 'status-rejected'
  }
  if (status.includes('通过') || status.includes('完成')) {
    return 'status-approved'
  }
  return ''
}
</script>

<template>
  <scroll-view
    class="renovation-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="renovation-item">
        <!-- 头部：日期时间和状态 -->
        <view class="item-header">
          <text class="item-datetime">{{ item.datetime }}</text>
          <text class="item-status" :class="{ 'status-completed': item.isCompleted }">{{
            item.status
          }}</text>
        </view>

        <!-- 标题和标签 -->
        <view class="item-title-row">
          <text class="item-title">{{ item.title }}</text>
          <!-- <view class="item-tags">
            <text v-for="(tag, index) in item.tags" :key="index" class="tag">{{ tag }}</text>
          </view> -->
        </view>

        <!-- 详细信息 -->
        <view class="item-details">
          <view class="detail-row">
            <text class="detail-label">地址：</text>
            <text class="detail-value">{{ item.address }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">房间号：</text>
            <text class="detail-value">{{ item.roomNumber }}</text>
          </view>
          <view class="detail-row">
            <text class="detail-label">负责人：</text>
            <text class="detail-value">{{ item.worker }}-{{ item.workerPhone }}</text>
          </view>
        </view>

        <!-- 审核进度（有数据才显示） -->
        <view v-if="item.auditProgress && item.auditProgress.length > 0" class="audit-progress">
          <view class="progress-title">审核进度：</view>
          <view class="progress-content">
            <view
              v-for="(progress, index) in item.auditProgress"
              :key="index"
              class="progress-item"
            >
              <view class="progress-row">
                <text class="progress-name">{{ progress.name }}</text>
                <text class="progress-status" :class="getStatusClass(progress.status)">{{
                  progress.status
                }}</text>
                <text class="progress-datetime">{{ progress.datetime }}</text>
                <text class="progress-auditor">审核人{{ progress.auditor }}</text>
              </view>
              <view v-if="progress.remark" class="progress-remark">
                {{ progress.remark }}
              </view>
            </view>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="item-actions">
          <view
            v-for="btn in getVisibleButtons()"
            :key="btn.key"
            class="action-btn"
            @tap="handleButtonClick(btn.key, item)"
          >
            <text class="btn-text">{{ btn.label }}</text>
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
        <text class="empty-text">暂无装修记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.renovation-list {
  height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 400rpx);
  width: 100%;
  background: #fff;
}

.list-container {
  padding: 24rpx 30rpx;
}

.renovation-item {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.item-datetime {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #7b678f;
  line-height: 42rpx;
}

.item-status {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #6a6a6a;
  line-height: 42rpx;

  &.status-completed {
    color: #00b050;
  }
}

.item-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
  gap: 16rpx;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 36rpx;
}

.item-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.tag {
  padding: 4rpx 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #666666;
  line-height: 32rpx;
}

.item-details {
  margin-bottom: 24rpx;
}

.detail-row {
  display: flex;
  margin-bottom: 12rpx;
  line-height: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }
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
  flex: 1;
  word-wrap: break-word;
}

.audit-progress {
  margin-top: 24rpx;
  padding-top: 24rpx;
  background: #f8fafa;
  border-radius: 10rpx;
  padding: 18rpx 24rpx;
}

.progress-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #1c1c1c;
  line-height: 40rpx;
  margin-bottom: 12rpx;
}

.progress-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.progress-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.progress-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
  line-height: 40rpx;
}

.progress-name {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #1c1c1c;
}

.progress-status {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #6a6a6a;

  &.status-rejected {
    color: #ff0000;
  }

  &.status-approved {
    color: #00b050;
  }
}

.progress-datetime {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #1c1c1c;
  color: #6a6a6a;
}

.progress-auditor {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #1c1c1c;
}

.progress-remark {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #1c1c1c;
  line-height: 48rpx;
  padding-left: 0;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 32rpx;
  padding-top: 24rpx;
}

.action-btn {
  width: calc(25% - 12rpx);
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 30rpx;
  border: 2px solid #863fce;

  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #863fce;
  line-height: 40rpx;

  &:active {
    opacity: 0.8;
    background: #f9f5ff;
  }
}

.btn-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #8b5cf6;
  line-height: 36rpx;
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
