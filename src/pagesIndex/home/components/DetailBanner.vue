<template>
  <view class="banner">
    <!-- 轮播图 -->
    <swiper
      v-if="activeTab === 'image'"
      class="banner__swiper"
      :autoplay="true"
      :circular="true"
      :interval="4000"
      :duration="500"
      :indicator-dots="false"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(img, idx) in displayBanners" :key="idx">
        <image class="banner__img" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>

    <!-- 户型图 -->
    <view v-else-if="activeTab === 'layout'" class="banner__layout">
      <image class="banner__img" :src="layoutImage" mode="aspectFit" />
    </view>

    <!-- VR看房 - 显示提示图 -->
    <view v-else-if="activeTab === 'vr'" class="banner__vr" @tap="openVR">
      <image
        class="banner__img"
        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1600&auto=format&fit=crop"
        mode="aspectFill"
      />
      <view class="banner__vr-overlay">
        <view class="vr-icon">VR</view>
        <text class="vr-text">点击进入VR看房</text>
      </view>
    </view>

    <!-- 视频 -->
    <video
      v-else-if="activeTab === 'video'"
      class="banner__video"
      :src="videoUrl"
      :controls="true"
      :autoplay="false"
      :show-center-play-btn="true"
      :enable-progress-gesture="true"
      object-fit="contain"
    ></video>

    <!-- 返回按钮 -->
    <view class="back" :style="{ top: safeAreaInsets!.top + 10 + 'px' }">
      <image
        class="back-icon"
        @tap="handleBack"
        src="/static/tabs/backWhite.png"
        mode="aspectFit"
      ></image>
    </view>

    <!-- 媒体标签 - 动态显示 -->
    <view v-if="visibleMediaTabs.length > 1" class="media-tabs">
      <view class="media-tabs__wrap">
        <view
          v-for="tab in visibleMediaTabs"
          :key="tab.key"
          class="media-tabs__item"
          :class="{ 'is-active': tab.key === activeTab }"
          @tap="switchTab(tab.key)"
        >
          {{ tab.label }}
        </view>
      </view>
    </view>

    <!-- 图片计数器 - 仅在轮播图模式显示 -->
    <view v-if="activeTab === 'image'" class="banner__counter">
      {{ currentIndex + 1 }}/{{ displayBanners.length }}
    </view>

    <view class="banner__blur-mask"></view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
const { safeAreaInsets } = uni.getSystemInfoSync()

interface Props {
  banners?: string[] // 轮播图数组
  layoutImage?: string // 户型图
  vrUrl?: string // VR地址
  videoUrl?: string // 视频地址
  useTestData?: boolean // 是否使用测试数据
}

const props = withDefaults(defineProps<Props>(), {
  banners: () => [],
  layoutImage: '',
  vrUrl: '',
  videoUrl: '',
  useTestData: false, // 默认不使用测试数据
})

// Emits
const emit = defineEmits<{
  back: []
  tabChange: [key: MediaKey]
}>()

// ==================== 测试数据 ====================
const testData = {
  banners: [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop',
  ],
  layoutImage:
    'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=1600&auto=format&fit=crop',
  vrUrl:
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', // 测试视频
}

// ==================== 数据处理 ====================
// 轮播图数据
const displayBanners = computed(() => {
  if (props.useTestData) {
    return testData.banners
  }
  return props.banners && props.banners.length > 0
    ? props.banners
    : [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
      ]
})

// 户型图
const layoutImage = computed(() => {
  if (props.useTestData) {
    return testData.layoutImage
  }
  return props.layoutImage || ''
})

// VR地址
const vrUrl = computed(() => {
  if (props.useTestData) {
    return testData.vrUrl
  }
  return props.vrUrl || ''
})

// 视频地址
const videoUrl = computed(() => {
  if (props.useTestData) {
    return testData.videoUrl
  }
  return props.videoUrl || ''
})

// ==================== 媒体标签 ====================
type MediaKey = 'image' | 'layout' | 'vr' | 'video'

// 根据数据动态显示媒体标签
const visibleMediaTabs = computed(() => {
  const tabs: Array<{ key: MediaKey; label: string }> = []

  // 图片 - 始终显示（至少有默认图片）
  if (displayBanners.value.length > 0) {
    tabs.push({ key: 'image', label: '图片' })
  }

  // 户型图 - 有数据才显示
  if (layoutImage.value) {
    tabs.push({ key: 'layout', label: '户型图' })
  }

  // VR看房 - 有数据才显示
  if (vrUrl.value) {
    tabs.push({ key: 'vr', label: 'VR看房' })
  }

  // 视频 - 有数据才显示
  if (videoUrl.value) {
    tabs.push({ key: 'video', label: '视频' })
  }

  return tabs
})

// 当前激活的标签
const activeTab = ref<MediaKey>('image')

// 切换标签
const switchTab = (key: MediaKey) => {
  activeTab.value = key
  emit('tabChange', key)
  console.log('切换媒体标签:', key)
}

// ==================== 轮播图相关 ====================
const currentIndex = ref(0)
const onSwiperChange = (e: any) => {
  currentIndex.value = e?.detail?.current ?? 0
}

// ==================== VR看房 ====================
const openVR = () => {
  if (!vrUrl.value) {
    uni.showToast({
      title: '暂无VR数据',
      icon: 'none',
    })
    return
  }

  // 跳转到VR页面
  uni.navigateTo({
    url: `/pagesIndex/home/vr?url=${encodeURIComponent(vrUrl.value)}`,
    fail: () => {
      // 如果跳转失败，尝试使用外部浏览器打开
      uni.showModal({
        title: '提示',
        content: '是否在浏览器中打开VR看房？',
        success: (res) => {
          if (res.confirm) {
            // #ifdef H5
            window.open(vrUrl.value, '_blank')
            // #endif
            // #ifndef H5
            uni.showToast({
              title: '请在H5端查看',
              icon: 'none',
            })
            // #endif
          }
        },
      })
    },
  })
}

// ==================== 返回 ====================
const handleBack = () => {
  emit('back')
}
</script>

<style lang="scss" scoped>
$primary: #863fce;
$card-radius: 22rpx;

.back {
  position: absolute;
  left: 38rpx;
  top: 0;
  z-index: 10;
  .back-icon {
    width: 38rpx;
    height: 38rpx;
  }
}

.banner {
  position: relative;
  height: 520rpx;
  background: #eee;

  &__swiper {
    width: 100%;
    height: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    overflow: hidden;
  }

  &__layout {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
  }

  &__vr {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  &__vr-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;

    .vr-icon {
      width: 120rpx;
      height: 120rpx;
      margin-bottom: 20rpx;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48rpx;
      font-weight: bold;
      color: #fff;
      border: 4rpx solid #fff;
    }

    .vr-text {
      color: #fff;
      font-size: 28rpx;
      font-weight: 500;
    }
  }

  &__video {
    width: 100%;
    height: 100%;
  }

  &__img {
    width: 100%;
    height: 100%;
    display: block;
  }

  &__counter {
    position: absolute;
    right: 20rpx;
    bottom: 115rpx;
    padding: 8rpx 16rpx;
    color: #fff;
    font-weight: 400;
    font-size: 22rpx;
    line-height: 1;
    z-index: 2;
    width: 86rpx;
    height: 44rpx;
    background: #000000;
    border-radius: 22rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__blur-mask {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 75rpx;
    backdrop-filter: blur(10rpx);
    -webkit-backdrop-filter: blur(10rpx);
    z-index: 1;
  }
}

.media-tabs {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 115rpx;
  display: flex;
  justify-content: center;
  z-index: 2;

  &__wrap {
    display: inline-flex;
    border-radius: 999rpx;
    overflow: hidden;
    height: 44rpx;
    align-items: center;
    font-size: 22rpx;
    background: rgba(255, 255, 255, 0.6);
  }

  &__item {
    padding: 8rpx 28rpx;
    font-size: 26rpx;
    color: #555;
    font-size: 22rpx;
    border-radius: $card-radius;
  }

  .is-active {
    background: $primary;
    color: #fff;
    opacity: 1;
  }
}
</style>
