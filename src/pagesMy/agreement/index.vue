<template>
  <view class="agreement-page">
    <!-- 自定义导航栏 -->
    <view class="custom-navbar" :style="{ paddingTop: safeAreaTop + 'px' }">
      <view class="navbar-content">
        <view class="back-btn" @tap="handleBack">
          <uni-icons type="left" size="20" color="#333"></uni-icons>
        </view>
        <text class="navbar-title">{{ agreementData.title || '协议详情' }}</text>
        <view class="placeholder"></view>
      </view>
    </view>

    <view v-if="loading" class="loading-container">
      <uni-icons type="spinner-cycle" size="40" color="#863FCE"></uni-icons>
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 内容区域 -->
    <scroll-view v-else class="content-container" scroll-y>
      <view class="agreement-content">
        <!-- 标题 -->
        <view class="title">{{ agreementData.title }}</view>

        <!-- 时间 -->
        <view v-if="agreementData.created_at" class="time">
          更新时间：{{ getFormatDate(agreementData.created_at) }}
        </view>

        <!-- 富文本内容 -->
        <view class="rich-text">
          <rich-text :nodes="agreementData.content"></rich-text>
        </view>
      </view>

      <!-- 确认按钮 -->
      <!-- <view class="btn-container">
        <view class="confirm-btn" @tap="handleConfirm">
          <text>我已知晓</text>
        </view>
      </view> -->
      <ShBottomBtns
        :fixed="true"
        :buttons="bottomButtons"
        backgroundColor="none"
        :paddingBottom="40"
        @click="handleButtonClick"
      />
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRegisterAgreementAPI } from '@/services/index/page'
import { onLoad } from '@dcloudio/uni-app'

const bottomButtons = [
  {
    text: '我已知晓',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    uni.navigateBack()
  }
}

const getFormatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

// 获取安全区域高度
const safeAreaTop = ref(0)
const loading = ref(true)
const agreementId = ref(0)

// 协议数据
interface AgreementData {
  title: string
  created_at: string
  content: string
}

const agreementData = ref<AgreementData>({
  title: '',
  created_at: '',
  content: '',
})

// 获取系统信息
onMounted(() => {
  const systemInfo = uni.getSystemInfoSync()
  safeAreaTop.value = systemInfo.statusBarHeight || 0
})

// 页面加载时获取参数
onLoad((options: any) => {
  if (options.id) {
    agreementId.value = Number(options.id)
    loadAgreementData()
  } else {
    uni.showToast({
      title: '参数错误',
      icon: 'none',
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

// 加载协议数据
const loadAgreementData = async () => {
  try {
    loading.value = true
    const res = await getRegisterAgreementAPI(agreementId.value)
    if (res.code === 200 && res.data) {
      agreementData.value = res.data
    } else {
      uni.showToast({
        title: res.msg || '加载失败',
        icon: 'none',
      })
    }
  } catch (error) {
    console.error('加载协议失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  uni.navigateBack()
}

// 确认
const handleConfirm = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.agreement-page {
  width: 100%;
  height: 100vh;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.custom-navbar {
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;

  .navbar-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;

    .back-btn {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .navbar-title {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
    }

    .placeholder {
      width: 60rpx;
    }
  }
}

.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .loading-text {
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #999999;
  }
}

.content-container {
  flex: 1;
  height: 0;
}

.agreement-content {
  background: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 40rpx;

  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: #333333;
    line-height: 50rpx;
    margin-bottom: 20rpx;
    text-align: center;
  }

  .time {
    font-size: 24rpx;
    color: #999999;
    text-align: center;
    margin-bottom: 40rpx;
    padding-bottom: 30rpx;
    border-bottom: 1px solid #f0f0f0;
  }

  .rich-text {
    font-size: 28rpx;
    color: #666666;
    line-height: 44rpx;

    :deep(p) {
      margin-bottom: 20rpx;
      text-indent: 2em;
    }

    :deep(img) {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 20rpx auto;
    }

    :deep(h1),
    :deep(h2),
    :deep(h3),
    :deep(h4),
    :deep(h5),
    :deep(h6) {
      font-weight: 600;
      color: #333333;
      margin: 30rpx 0 20rpx;
    }

    :deep(h1) {
      font-size: 36rpx;
    }

    :deep(h2) {
      font-size: 34rpx;
    }

    :deep(h3) {
      font-size: 32rpx;
    }

    :deep(ul),
    :deep(ol) {
      padding-left: 40rpx;
      margin: 20rpx 0;
    }

    :deep(li) {
      margin-bottom: 10rpx;
    }

    :deep(strong),
    :deep(b) {
      font-weight: 600;
      color: #333333;
    }

    :deep(a) {
      color: #863fce;
      text-decoration: underline;
    }
  }
}

.btn-container {
  padding: 30rpx 40rpx;
  background: #ffffff;
  margin: 20rpx;
  border-radius: 16rpx;

  .confirm-btn {
    height: 88rpx;
    background: #863fce;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    text {
      font-size: 32rpx;
      font-weight: 500;
      color: #ffffff;
    }

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
