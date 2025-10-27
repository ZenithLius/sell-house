<template>
  <view class="bottom-tabbar">
    <view
      v-for="tab in tabList"
      :key="tab.key"
      class="tab-item"
      :class="{ active: currentTab === tab.key }"
      @tap="handleTabClick(tab.key)"
    >
      <image
        :src="currentTab === tab.key ? tab.activeIcon : tab.icon"
        class="tab-icon"
        mode="aspectFit"
      />
      <text class="tab-text">{{ tab.text }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type TabKey = 'myHouse' | 'photo' | 'calculator' | 'card'

interface TabItem {
  key: TabKey
  text: string
  icon: string
  activeIcon: string
}

const currentTab = ref<TabKey>('myHouse')

const tabList = ref<TabItem[]>([
  {
    key: 'myHouse',
    text: '我的房源',
    icon: '/pagesMy/static/myHouse.png',
    activeIcon: '/pagesMy/static/myHouseActive.png',
  },
  {
    key: 'photo',
    text: '实勘房源',
    icon: '/pagesMy/static/myPhoto.png',
    activeIcon: '/pagesMy/static/myPhotoActive.png',
  },
  {
    key: 'calculator',
    text: '计算器',
    icon: '/pagesMy/static/myCalculator.png',
    activeIcon: '/pagesMy/static/myCalculatorActive.png',
  },
  {
    key: 'card',
    text: '员工打卡',
    icon: '/pagesMy/static/myCard.png',
    activeIcon: '/pagesMy/static/myCardActive.png',
  },
])

const handleTabClick = (key: TabKey) => {
  currentTab.value = key

  switch (key) {
    case 'myHouse':
      console.log('我的房源')
      break
    case 'photo':
      uni.navigateTo({
        url: '/pagesMy/siteInspection/index',
      })
      break
    case 'calculator':
      console.log('计算器')
      break
    case 'card':
      console.log('员工打卡')

      break
  }
}
</script>

<style lang="scss" scoped>
.bottom-tabbar {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) - 5rpx);
  left: 0;
  right: 0;
  height: 100rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  // padding-bottom: env(safe-area-inset-bottom);
  z-index: 2;

  .tab-item {
    flex: 1;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // padding: 10rpx 0;
    margin: 15rpx 0;

    .tab-icon {
      width: 41rpx;
      height: 41rpx;
      margin-bottom: 6rpx;
    }

    .tab-text {
      font-size: 22rpx;
      color: #333;
      transition: color 0.3s;
    }

    &.active {
      .tab-text {
        color: #7c3aed;
        font-weight: 500;
      }
    }
  }
}
</style>
