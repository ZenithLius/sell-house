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
import { onLoad, onShow, onUnload } from '@dcloudio/uni-app'

type TabKey = 'myHouse' | 'photo' | 'calculator' | 'card' | 'pendingReview' | 'performance'

interface TabItem {
  key: TabKey
  text: string
  icon: string
  activeIcon: string
}

const currentTab = ref<TabKey>('myHouse')
const currentRole = uni.getStorageSync('currentOtherManageType')

// 根据角色动态构建 tabList
const getTabListByRole = () => {
  if (currentRole === 'manager') {
    return [
      {
        key: 'myHouse' as TabKey,
        text: '我的房源',
        icon: '/pagesMy/static/myHouse.png',
        activeIcon: '/pagesMy/static/myHouseActive.png',
      },
      {
        key: 'pendingReview' as TabKey,
        text: '待审核',
        icon: '/pagesMy/static/pendingReview.png',
        activeIcon: '/pagesMy/static/pendingReviewActive.png',
      },
      {
        key: 'performance' as TabKey,
        text: '员工业绩',
        icon: '/pagesMy/static/performanceActive.png',
        activeIcon: '/pagesMy/static/performanceActive.png',
      },
      {
        key: 'calculator' as TabKey,
        text: '计算器',
        icon: '/pagesMy/static/myCalculator.png',
        activeIcon: '/pagesMy/static/myCalculatorActive.png',
      },
      {
        key: 'card' as TabKey,
        text: '员工打卡',
        icon: '/pagesMy/static/myCard.png',
        activeIcon: '/pagesMy/static/myCardActive.png',
      },
    ]
  }
  return [
    {
      key: 'myHouse' as TabKey,
      text: '我的房源',
      icon: '/pagesMy/static/myHouse.png',
      activeIcon: '/pagesMy/static/myHouseActive.png',
    },
    {
      key: 'photo' as TabKey,
      text: '实勘房源',
      icon: '/pagesMy/static/myPhoto.png',
      activeIcon: '/pagesMy/static/myPhotoActive.png',
    },
    {
      key: 'calculator' as TabKey,
      text: '计算器',
      icon: '/pagesMy/static/myCalculator.png',
      activeIcon: '/pagesMy/static/myCalculatorActive.png',
    },
    {
      key: 'card' as TabKey,
      text: '员工打卡',
      icon: '/pagesMy/static/myCard.png',
      activeIcon: '/pagesMy/static/myCardActive.png',
    },
  ]
}

const tabList = ref<TabItem[]>(getTabListByRole())
const getRouteByTab = (key: TabKey): string => {
  const currentRole = uni.getStorageSync('currentOtherManageType')

  const routeMap: Record<TabKey, string> = {
    myHouse: currentRole === 'manager' ? '/pagesMy/manage/index' : '/pagesMy/authentication/index',
    photo: '/pagesMy/siteInspection/index',
    calculator: '/pagesMy/calculator/index',
    card: '/pagesMy/checkIn/index',
    pendingReview: '/pagesMy/pendingReview/index',
    performance: '/pagesMy/performance/index',
  }

  return routeMap[key]
}

const handleTabClick = (key: TabKey) => {
  uni.setStorageSync('currentMyHouseSourceTab', key)
  currentTab.value = key

  const url = getRouteByTab(key)
  uni.redirectTo({ url })
}

onLoad(() => {
  const currentMyHouseSourceTab = uni.getStorageSync('currentMyHouseSourceTab')
  if (currentMyHouseSourceTab) {
    currentTab.value = currentMyHouseSourceTab
  }

  console.log('currentTab.value222', currentTab.value)
})

onShow(() => {
  const currentMyHouseSourceTab = uni.getStorageSync('currentMyHouseSourceTab')
  if (currentMyHouseSourceTab) {
    currentTab.value = currentMyHouseSourceTab
  }
})
</script>

<style lang="scss" scoped>
.bottom-tabbar {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom));
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
