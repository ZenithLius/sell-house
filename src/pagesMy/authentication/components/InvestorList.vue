<script setup lang="ts">
import { ref } from 'vue'

interface InvestorItem {
  id: string | number
  nickname: string
  mobile: string
}

const props = defineProps({
  list: {
    type: Array as () => InvestorItem[],
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
  selectedId: {
    type: [String, Number],
    default: null,
  },
})

const emit = defineEmits<{
  loadMore: []
  select: [id: string | number]
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

// 选择投资人
const handleSelect = (id: string | number) => {
  emit('select', id)
}
</script>

<template>
  <scroll-view
    class="investor-list"
    scroll-y
    :scroll-top="scrollTop"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="investor-item" @tap="handleSelect(item.id)">
        <!-- 左侧手机图标 -->
        <view class="left">
          <view class="top">
            <text class="item-name">{{ item.nickname }}</text></view
          >
          <view class="bottom">
            <view class="icon-wrapper">
              <image class="phone-icon" src="@/static/customers/phone.png" mode="aspectFit" />
            </view>

            <!-- 中间内容 -->
            <view class="item-content">
              <text class="item-phone">{{ item.mobile }}</text>
            </view>
          </view>
        </view>

        <!-- 右侧选择图标 -->
        <view class="select-wrapper">
          <image
            v-if="selectedId === item.id"
            class="select-icon"
            src="@/pagesMy/static/selected.png"
            mode="aspectFit"
          />
          <image
            v-else
            class="select-icon"
            src="@/pagesMy/static/willSelect.png"
            mode="aspectFit"
          />
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
        <text class="empty-text">暂无投资人信息</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.investor-list {
  flex: 1;
  width: 100%;
  height: calc(100vh - env(safe-area-inset-bottom) - 100rpx);
  background: #ffffff;
}

.list-container {
  padding: 29rpx 30rpx;
}
.bottom {
  align-items: center;

  display: flex;
}
.investor-item {
  display: flex;
  align-items: center;
  padding: 41rpx 30rpx 38rpx 33rpx;
  background: #ffffff;
  border-radius: 20rpx;
  border-bottom: 1px solid #f3f3f3;
  justify-content: space-between;
}
.left {
  display: flex;
  flex-direction: column;
  row-gap: 23rpx;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 24rpx;
}

.phone-icon {
  width: 20rpx;
  height: 30rpx;
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  min-width: 0;
}

.item-name {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #4e5651;
  line-height: 42rpx;
}

.item-phone {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #8a8989;
  line-height: 42rpx;
}

// 选择图标
.select-wrapper {
  width: 48rpx;
  height: 48rpx;
  margin-left: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-icon {
  width: 48rpx;
  height: 48rpx;
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
