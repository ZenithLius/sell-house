<template>
  <view class="main-tabbar">
    <view
      v-for="tab in tabList"
      :key="tab.pagePath"
      class="tab-item"
      :class="{ active: currentPath === tab.pagePath }"
      @tap="handleTabClick(tab.pagePath)"
    >
      <image
        :src="currentPath === tab.pagePath ? tab.selectedIconPath : tab.iconPath"
        class="tab-icon"
        mode="aspectFit"
      />
      <text
        class="tab-text"
        :style="{ color: currentPath === tab.pagePath ? selectedColor : color }"
      >
        {{ tab.text }}
      </text>
    </view>

    <ShLoginPopup ref="loginPopup" />
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import ShLoginPopup from '@/components/ShLoginPopup.vue'
import { useMemberStore } from '@/stores'

const loginPopup = ref<InstanceType<typeof ShLoginPopup> | null>(null)

interface TabItem {
  text: string
  pagePath: string
  iconPath: string
  selectedIconPath: string
}

// TabBar 配置
const tabList = ref<TabItem[]>([
  {
    text: '首页',
    pagePath: 'pages/index/index',
    iconPath: '/static/tabs/indexPage.png',
    selectedIconPath: '/static/tabs/indexPageActive.png',
  },
  {
    text: '获客',
    pagePath: 'pages/customers/index',
    iconPath: '/static/tabs/customer.png',
    selectedIconPath: '/static/tabs/customerActive.png',
  },
  {
    text: '卖房',
    pagePath: 'pages/house/index',
    iconPath: '/static/tabs/sellHouse.png',
    selectedIconPath: '/static/tabs/sellHuseActive.png',
  },
  {
    text: '资讯',
    pagePath: 'pages/consult/index',
    iconPath: '/static/tabs/news.png',
    selectedIconPath: '/static/tabs/newsActive.png',
  },
  {
    text: '我的',
    pagePath: 'pages/my/index',
    iconPath: '/static/tabs/my.png',
    selectedIconPath: '/static/tabs/myActive.png',
  },
])

// 颜色配置
const color = ref('#333')
const selectedColor = ref('#863FCE')

// 当前路径
const currentPath = ref('')

// 获取当前页面路径
const getCurrentPath = () => {
  const pages = getCurrentPages()
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1]
    return currentPage.route || ''
  }
  return ''
}

// 更新当前路径
const updateCurrentPath = () => {
  currentPath.value = getCurrentPath()
}

// 切换 Tab
const handleTabClick = (pagePath: string) => {
  if (currentPath.value === pagePath) {
    return
  }
  if (pagePath === 'pages/customers/index' || pagePath === 'pages/house/index') {
    const memberStore = useMemberStore()
    if (!memberStore.profile) {
      loginPopup.value?.open()
      return
    }
  }

  uni.switchTab({
    url: `/${pagePath}`,
  })
}

onShow(() => {
  updateCurrentPath()
})

updateCurrentPath()
</script>

<style lang="scss" scoped>
.main-tabbar {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  height: 100rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 20rpx 20rpx 0rpx 0rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
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
