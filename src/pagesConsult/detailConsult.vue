<template>
  <view class="detail-consult">
    <ShNavbar @back="back" :title="'详情'" :showBack="true" class="navbar-fixed" />
    <view class="content-wrapper" :style="{ paddingTop: safeAreaInsets!.top + 60 + 'px'}">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading">加载中...</view>
      <!-- 内容区域 -->
      <view v-else>
        <view class="topTitle">{{ topContent?.title }}</view>
        <view class="date">{{ topContent?.create_time }}</view>
        <!-- 富文本内容 -->
        <view class="rich-text-container">
          <rich-text :nodes="topContent?.content"></rich-text>
          <!-- 视频内容 -->
          <view v-if="videoUrl" class="video-wrapper">
            <view class="video-title">视频讲解</view>
            <video
              :src="videoUrl"
              :controls="true"
              :show-center-play-btn="true"
              :enable-progress-gesture="true"
              class="detail-video"
            ></video>
          </view>
          <!-- 视频后的富文本内容 -->
          <rich-text v-if="htmlContentAfterVideo" :nodes="htmlContentAfterVideo"></rich-text>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getConsultDetailAPI, type ConsultDetailResult } from '@/services/consult'

const { safeAreaInsets } = uni.getSystemInfoSync()

const back = () => {
  uni.navigateBack()
}

const id = ref<string | number>('')
const loading = ref(true)
const htmlContent = ref('')
const videoUrl = ref('')
const htmlContentAfterVideo = ref('')
const topContent = ref<ConsultDetailResult>()

onLoad((options) => {
  if (options?.id) {
    id.value = options.id
    console.log('传递过来的id', id.value)
    // 获取详情数据
    getDetailContentReq(Number(options.id))
  } else {
    loading.value = false
  }
})

const getDetailContentReq = async (id: number) => {
  const res = await getConsultDetailAPI({ id })
  if (res.code === 200) {
    topContent.value = res.data
    loading.value = false
  }
}
</script>
<style lang="scss" scoped>
.topTitle {
  font-family: Source Han Sans CN;
  font-weight: bold;
  font-size: 40rpx;
  color: #1a1a1e;
  line-height: 60rpx;
}
.date {
  padding-top: 40rpx;
  padding-bottom: 40rpx;
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #959595;
}
.detail-consult {
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
  min-height: 100vh;
  background-color: #fff;

  .content-wrapper {
    padding: 20rpx;

    .loading {
      text-align: center;
      padding: 100rpx 0;
      font-size: 28rpx;
      color: #999;
    }

    .rich-text-container {
      background-color: #fff;
      border-radius: 16rpx;
      overflow: hidden;

      :deep(img) {
        max-width: 100% !important;
        height: auto !important;
        display: block;
      }

      :deep(p) {
        word-wrap: break-word;
        word-break: break-all;
      }

      .video-wrapper {
        padding: 20rpx;
        margin: 20rpx 0;

        .video-title {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
          margin-bottom: 20rpx;
        }

        .detail-video {
          width: 100%;
          height: 400rpx;
          border-radius: 12rpx;
          background-color: #000;
        }
      }
    }
  }
}
</style>
