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
    icon: '/static/my/myHouse.png',
    activeIcon: '/static/my/myHouseActive.png',
  },
  {
    key: 'photo',
    text: '实勘房源',
    icon: '/static/my/myPhoto.png',
    activeIcon: '/static/my/myPhotoActive.png',
  },
  {
    key: 'calculator',
    text: '计算器',
    icon: '/static/my/myCalculator.png',
    activeIcon: '/static/my/myCalculatorActive.png',
  },
  {
    key: 'card',
    text: '员工打卡',
    icon: '/static/my/myCard.png',
    activeIcon: '/static/my/myCardActive.png',
  },
])

const handleTabClick = (key: TabKey) => {
  currentTab.value = key

  switch (key) {
    case 'myHouse':
      console.log('我的房源')
      break
    case 'photo':
      console.log('实勘房源')
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
  bottom: calc(env(safe-area-inset-bottom) - 15rpx);
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
    padding: 10rpx 0;

    .tab-icon {
      width: 41rpx;
      height: 41rpx;
      margin-bottom: 6rpx;
    }

    .tab-text {
      font-size: 22rpx;
      color: #666;
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
