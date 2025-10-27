<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'跟进记录'"
      :showBack="true"
      class="navbar-fixed"
    />
    <scroll-view scroll-y class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <!-- 房源标题 -->
      <view class="house-title">{{ houseTitle }}</view>

      <!-- 跟进记录列表 -->
      <view class="record-list">
        <view v-for="(record, index) in recordList" :key="index" class="record-item">
          <!-- 时间 -->
          <view class="record-header">
            <view class="time-dot"></view>
            <text class="record-time">{{ record.time }}</text>
          </view>

          <!-- 内容 -->
          <view class="record-body">
            <text class="record-person">跟进人：{{ record.person }}</text>
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
    </scroll-view>
    <ShBottomBtns backgroundColor="#fff" :buttons="bottomButtons" @click="handleButtonClick" />
    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BottomTabbar from './components/BottomTabbar.vue'

interface RecordItem {
  time: string
  person: string
  title: string
  content: string
  images?: string[]
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
      url: '/pagesMy/authentication/addRecord',
    })
  }
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const houseTitle = ref('房源名称标题')

const recordList = ref<RecordItem[]>([
  {
    time: '2025.09.04 10:00:00',
    person: '李四',
    title: '标题文字',
    content: '内容文字介绍详情内容文字介绍详情内容文字介绍详情内容文字介绍详情',
    images: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
  {
    time: '2025.09.04 10:00:00',
    person: '李四',
    title: '标题文字',
    content: '内容文字介绍详情内容文字介绍详情内容文字介绍详情内容文字介绍详情',
    images: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
  {
    time: '2025.09.04 10:00:00',
    person: '李四',
    title: '标题文字',
    content: '内容文字介绍详情内容文字介绍详情内容文字介绍详情内容文字介绍详情',
    images: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
  {
    time: '2025.09.04 10:00:00',
    person: '李四',
    title: '标题文字',
    content: '内容文字介绍详情内容文字介绍详情内容文字介绍详情内容文字介绍详情',
    images: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
  {
    time: '2025.09.04 10:00:00',
    person: '李四',
    title: '标题文字',
    content: '内容文字介绍详情内容文字介绍详情内容文字介绍详情内容文字介绍详情',
    images: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
  {
    time: '2025.09.04 10:00:00',
    person: '李四',
    title: '标题文字',
    content: '内容文字介绍详情内容文字介绍详情内容文字介绍详情内容文字介绍详情',
    images: [
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    ],
  },
])

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
  height: calc(100vh - env(safe-area-inset-bottom) - 240rpx);
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

.record-item {
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
</style>
