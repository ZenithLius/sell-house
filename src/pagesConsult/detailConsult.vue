<template>
  <view class="detail-consult">
    <ShNavbar @back="back" :title="'详情'" :showBack="true" class="navbar-fixed" />
    <view class="content-wrapper" :style="{ paddingTop: safeAreaInsets!.top + 30 + 'px'}">
      <!-- 加载状态 -->
      <view v-if="loading" class="loading">加载中...</view>
      <!-- 富文本内容 -->
      <view v-else class="rich-text-container">
        <rich-text :nodes="htmlContent"></rich-text>
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
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
const { safeAreaInsets } = uni.getSystemInfoSync()
const back = () => {
  uni.navigateBack()
}

const id = ref<string | number>('')
const loading = ref(true)
const htmlContent = ref('')
const videoUrl = ref('')
const htmlContentAfterVideo = ref('')

// 模拟接口请求获取富文本数据
const fetchDetailContent = async (detailId: string | number) => {
  try {
    loading.value = true

    // TODO
    await new Promise((resolve) => setTimeout(resolve, 500))

    const mockData = {
      id: detailId,
      title: '咨询详情',
      content: `
        <div style="padding: 20px; line-height: 1.8;">
          <h2 style="font-size: 20px; font-weight: bold; color: #333; margin-bottom: 15px;">
            重要通知：关于房产咨询服务说明
          </h2>
          <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
            尊敬的客户，感谢您选择我们的服务。以下是本次咨询的详细内容：
          </p>
          <h3 style="font-size: 18px; font-weight: bold; color: #333; margin-top: 20px; margin-bottom: 10px;">
            一、服务内容概述
          </h3>
          <p style="font-size: 14px; color: #666; margin-bottom: 15px;">
            我们提供专业的房产咨询服务，包括但不限于：市场分析、价格评估、交易流程指导等。
          </p>
          <img src="https://picsum.photos/220/156?random=2"
               style="width: 100%; height: auto; border-radius: 8px; margin: 15px 0;" />
        </div>
      `,
      videoUrl: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
      contentAfterVideo: `
        <div style="padding: 20px; line-height: 1.8;">
          <h3 style="font-size: 18px; font-weight: bold; color: #333; margin-top: 20px; margin-bottom: 10px;">
            二、注意事项
          </h3>
          <ul style="font-size: 14px; color: #666; padding-left: 20px; margin-bottom: 15px;">
            <li style="margin-bottom: 8px;">请提前准备好相关证件和材料</li>
            <li style="margin-bottom: 8px;">咨询时间为工作日 9:00-18:00</li>
            <li style="margin-bottom: 8px;">如有疑问请及时联系客服人员</li>
          </ul>
          <img src="https://picsum.photos/220/156?random=2"
               style="width: 100%; height: auto; border-radius: 8px; margin: 15px 0;" />
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            <strong style="font-weight: bold; color: #333;">温馨提示：</strong>
            所有咨询服务均由专业顾问提供，确保您获得准确可靠的信息。
          </p>
        </div>
      `,
    }

    // const res = await uni.request({
    //   url: `https://your-api.com/api/consult/detail/${detailId}`,
    //   method: 'GET',
    // })
    // htmlContent.value = res.data.content
    // videoUrl.value = res.data.videoUrl
    // htmlContentAfterVideo.value = res.data.contentAfterVideo

    htmlContent.value = mockData.content
    videoUrl.value = mockData.videoUrl
    htmlContentAfterVideo.value = mockData.contentAfterVideo
  } catch (error) {
    console.error('获取详情失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

onLoad((options) => {
  if (options?.id) {
    id.value = options.id
    console.log('传递过来的id', id.value)
    // 获取详情数据
    fetchDetailContent(options.id)
  } else {
    loading.value = false
  }
})
</script>
<style lang="scss" scoped>
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
