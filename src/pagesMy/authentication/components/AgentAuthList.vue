<script setup lang="ts">
import { ref } from 'vue'

interface AgentAuthItem {
  agency_fee: string
  award: string
  commission: string
  created_at: string
  examine_at: string | null
  floor_img: string
  house_title: string
  per_price: string
  pharmacist_title: string
  pic: string
  style_bedroom: number
  style_house_title: string
  style_livingroom: number
  total_price: string
  house_list_title: string
}

const props = defineProps({
  list: {
    type: Array as () => AgentAuthItem[],
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
  refreshing: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  loadMore: []
  itemClick: [item: AgentAuthItem]
  refresh: []
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
const handleItemClick = (item: AgentAuthItem) => {
  emit('itemClick', item)
}

// 下拉刷新
const onRefresh = () => {
  emit('refresh')
}

// 刷新恢复
const onRestore = () => {}
</script>

<template>
  <scroll-view
    class="agent-auth-list"
    scroll-y
    :scroll-top="scrollTop"
    refresher-enabled
    :refresher-triggered="refreshing"
    @refresherrefresh="onRefresh"
    @refresherrestore="onRestore"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view
        v-for="(item, index) in list"
        :key="index"
        class="auth-item"
        @tap="handleItemClick(item)"
      >
        <view class="item-main">
          <view class="top">
            <!-- 左侧图片 -->
            <image class="item-image" :src="item.pic" mode="aspectFill"></image>

            <!-- 右侧信息 -->
            <view class="item-info">
              <!-- 日期时间 -->
              <text class="item-datetime">{{ item.created_at }}</text>

              <!-- 标题 -->
              <text class="item-title">{{ item.house_title || item.house_list_title }}</text>

              <!-- 房源基本信息 -->
              <view class="item-basic">
                <text class="basic-text"
                  >{{ item.style_livingroom }}室{{ item.style_bedroom }}厅</text
                >
                <text class="basic-text"
                  >{{ (Number(item.total_price) / Number(item.per_price)).toFixed(2) }}㎡</text
                >
                <text class="basic-text">{{ item.style_house_title }}</text>
                <text class="basic-text">{{ item.pharmacist_title }}</text>
              </view>

              <!-- 价格信息 -->
              <view class="item-price-row">
                <view class="price-info">
                  <text class="price-main">{{ item.total_price }}万</text>
                  <text class="price-unit">{{ item.per_price }}元/㎡</text>
                </view>
              </view>
            </view>
          </view>
          <view class="bottom">
            <!-- 佣金标签 -->
            <view v-if="item.commission" class="commission-badge">
              <image class="commission-icon" src="/static/images/commission.png"></image>
              <text class="commission-text">{{ item.commission }}</text>
            </view>
          </view>
        </view>

        <!-- 底部金额信息 -->
        <view class="item-amounts">
          <view class="amount-row">
            <text class="amount-label total">成单金额</text>
            <text class="amount-value total">¥ {{ item.total_price }}</text>
          </view>
          <view class="divider"></view>
          <view class="amount-row">
            <text class="amount-label">出房中介费</text>
            <text class="amount-value">¥ {{ item.agency_fee }}</text>
          </view>
          <view class="amount-row">
            <text class="amount-label">出房成交奖</text>
            <text class="amount-value">¥ {{ item.award }}</text>
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
        <text class="empty-text">暂无认证记录</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.agent-auth-list {
  height: calc(100vh - env(safe-area-inset-bottom) - env(safe-area-inset-top) - 400rpx);
  width: 100%;
  background: #ffffff;
}
.divider {
  width: 100%;
  height: 1rpx;
  background: #e8e8e8;
}
.list-container {
  padding: 20rpx 32rpx;
}

.auth-item {
  margin-bottom: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;

  &:active {
    opacity: 0.95;
  }
}

.item-main {
  display: flex;
  padding: 24rpx;
  gap: 20rpx;
  flex-direction: column;
  .top {
    display: flex;
    column-gap: 22rpx;
  }
}

.item-image {
  width: 206rpx;
  height: 208rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.item-datetime {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 20rpx;
  color: #999999;
  line-height: 28rpx;
  margin-bottom: 8rpx;
  display: flex;
  justify-content: flex-end;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 30rpx;
  color: #030509;
  margin-bottom: 12rpx;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-basic {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #030509;
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
  flex-wrap: wrap;
}

.basic-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #666666;
  line-height: 30rpx;
}

.item-price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.price-main {
  font-family: Source Han Sans CN;
  font-weight: bold;
  font-size: 36rpx;
  color: #f9432e;
  line-height: 42rpx;
}

.price-unit {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #908d94;
  line-height: 42rpx;
}

.commission-badge {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.commission-icon {
  width: 29rpx;
  height: 37rpx;
}

.commission-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #f9432e;
  line-height: 42rpx;
  margin-left: 10rpx;
}

.item-amounts {
  display: flex;
  flex-direction: column;
  background: #f8fafa;
  padding: 20rpx 24rpx;
  gap: 16rpx;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.amount-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #908c94;
  line-height: 42rpx;
  &.total {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 24rpx;
    color: #030509;
    line-height: 42rpx;
  }
}

.amount-value {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 42rpx;

  &.total {
    font-size: 28rpx;
    color: #f9432e;
    font-weight: bold;
  }
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
