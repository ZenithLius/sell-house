<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'跟进记录'"
      :showBack="true"
      class="navbar-fixed"
    />

    <scroll-view
      scroll-y
      class="content"
      :class="{ 'has-bottom-btn': currentRole === 'manager' }"
      :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }"
      refresher-enabled
      :refresher-triggered="isTriggered"
      @refresherrefresh="onRefresherrefresh"
      @scrolltolower="handleScrollToLower"
    >
      <!-- 房源标题 -->
      <view class="house-title">{{ houseTitle }}</view>

      <!-- 跟进记录列表 -->
      <view class="record-list">
        <view v-for="(record, index) in list" :key="index" class="record-item">
          <!-- 时间 -->
          <view class="record-header">
            <view class="time-dot"></view>
            <text class="record-time">{{ record.created_time }}</text>
          </view>

          <!-- 内容 -->
          <view class="record-body">
            <text class="record-person">跟进人：{{ record.user_name }}</text>
            <text class="record-title">{{ record.title }}</text>
            <text class="record-content">{{ record.content }}</text>

            <!-- 图片 -->
            <view v-if="record.images && record.images.length > 0" class="record-images">
              <image
                v-for="(img, imgIndex) in record.images"
                :key="imgIndex"
                class="record-image"
                :src="img"
                mode="aspectFill"
                @click="previewImage(record.images, img)"
              />
            </view>
          </view>
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading-more">加载中...</view>
      <view v-else-if="!hasMore && list.length > 0" class="no-more">没有更多了</view>
      <view v-else-if="isEmpty" class="empty-tip">暂无跟进记录</view>
    </scroll-view>
    <ShBottomBtns
      v-if="currentRole !== 'manager'"
      backgroundColor="#fff"
      :paddingBottom="20"
      :buttons="bottomButtons"
      @click="handleButtonClick"
    />
    <!-- <BottomTabbar /> -->
    <!-- <ShBottomTabbar /> -->
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { followRecordListAPI, followRecordListManagerAPI } from '@/pagesMy/services/staff'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useScrollRefresh } from '@/composables/testUseScroller'
const currentRole = uni.getStorageSync('currentOtherManageType')

/**
 *                                 @异步请求相关
 * ==========================================================================
 */

const currentHouseId = ref('')
const houseTitle = ref('')

// 定义数据获取函数
const fetchFollowRecordData = async (page: number) => {
  const params = {
    house_list_id: currentHouseId.value,
    page,
    per_page: 10,
  }
  const res =
    currentRole === 'manager'
      ? await followRecordListManagerAPI(params)
      : await followRecordListAPI(params)
  if (res.code === 200) {
    const processedList = (res.data.list || []).map((item: RecordItem) => ({
      ...item,
      images: item.mul_img?.split(',').filter(Boolean) || [],
    }))
    return processedList
  }
  return []
}

const {
  list,
  isLoading,
  hasMore,
  isTriggered,
  isEmpty,
  onRefresherrefresh,
  handleScrollToLower,
  refresh,
} = useScrollRefresh<RecordItem>({
  fetchData: fetchFollowRecordData,
  pageSize: 10,
  immediate: false,
})

onLoad(async (options) => {
  currentHouseId.value = options?.house_list_id || ''
  houseTitle.value = options?.title || ''
  await refresh()
})

onShow(async () => {
  if (currentHouseId.value) {
    await refresh()
  }
})

interface RecordItem {
  created_time: string
  user_name: string
  title: string
  content: string
  images?: string[]
  mul_img?: string
}
const bottomButtons = [
  {
    text: '新增记录',
    background: '#863FCE',
    color: '#ffffff',
  },
]
const handleButtonClick = (index: number) => {
  if (index === 0) {
    uni.navigateTo({
      url: `/pagesMy/authentication/addRecord?house_list_id=${currentHouseId.value}`,
    })
  }
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const handleBack = () => {
  uni.navigateBack()
}

const previewImage = (images: string[], currentUrl: string) => {
  uni.previewImage({
    urls: images,
    current: currentUrl,
  })
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}

.content {
  padding: 0 30rpx;
  background: #fff;
  height: calc(100vh - env(safe-area-inset-bottom) - 10rpx);
}
.has-bottom-btn {
  height: calc(100vh - env(safe-area-inset-bottom) - 10rpx);
}

.house-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #030509;
  line-height: 42rpx;
  padding: 24rpx 0;
  margin-left: 14rpx;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
  padding-bottom: 32rpx;
}

.record-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.time-dot {
  width: 20rpx;
  height: 20rpx;
  background: #863fce;
  border-radius: 50%;
  flex-shrink: 0;
}

.record-time {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #7b678f;
  line-height: 42rpx;
}

.record-body {
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  border-radius: 16rpx;
  padding: 30rpx 18rpx 40rpx 15rpx;
  gap: 12rpx;
}

.record-person {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #908c94;
  line-height: 42rpx;
}

.record-title {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #1a1a1e;
  line-height: 44rpx;
}

.record-content {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #908c94;
  line-height: 34rpx;
}

.record-images {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  margin-top: 8rpx;
}

.record-image {
  width: calc((100% - 64rpx) / 5);
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}

.loading-more,
.no-more,
.empty-tip {
  text-align: center;
  padding: 40rpx 0;
  font-size: 24rpx;
  color: #999;
}

.empty-tip {
  padding: 120rpx 0;
}
</style>
