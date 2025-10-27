<template>
  <view class="banner">
    <swiper
      class="banner__swiper"
      :autoplay="true"
      :circular="true"
      :interval="4000"
      :duration="500"
      :indicator-dots="false"
      @change="onSwiperChange"
    >
      <swiper-item v-for="(img, idx) in banners" :key="idx">
        <image class="banner__img" :src="img" mode="aspectFill" />
      </swiper-item>
    </swiper>
    <view class="back" :style="{ top: safeAreaInsets!.top +10 + 'px' }">
      <image
        class="back-icon"
        @tap="handleBack"
        src="/static/tabs/backWhite.png"
        mode="aspectFit"
      ></image>
    </view>
    <view class="media-tabs">
      <view class="media-tabs__wrap">
        <view
          v-for="tab in mediaTabs"
          :key="tab.key"
          class="media-tabs__item"
          :class="{ 'is-active': tab.key === activeTab }"
          @tap="switchTab(tab.key)"
        >
          {{ tab.label }}
        </view>
      </view>
    </view>
    <view class="banner__counter">{{ currentIndex + 1 }}/{{ banners.length }}</view>
    <view class="banner__blur-mask"></view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const { safeAreaInsets } = uni.getSystemInfoSync()

interface Props {
  banners?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  banners: () => [
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
  ],
})

// Emits
const emit = defineEmits<{
  back: []
  tabChange: [key: MediaKey]
}>()

const currentIndex = ref(0)
const onSwiperChange = (e: any) => {
  currentIndex.value = e?.detail?.current ?? 0
}

// 分段器
type MediaKey = 'image' | 'layout' | 'vr' | 'video'
const mediaTabs: Array<{ key: MediaKey; label: string }> = [
  { key: 'image', label: '图片' },
  { key: 'layout', label: '户型图' },
  { key: 'vr', label: 'VR看房' },
  { key: 'video', label: '视频' },
]
const activeTab = ref<MediaKey>('image')
const switchTab = (key: MediaKey) => {
  activeTab.value = key
  emit('tabChange', key)
}

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
