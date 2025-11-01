<template>
  <view class="menu-list">
    <view
      v-for="(item, index) in menuItems"
      :key="index"
      class="menu-item"
      @tap="handleMenuClick(item)"
    >
      <view class="menu-item-left">
        <image class="menu-icon" :src="item.icon"></image>
        <text class="menu-title">{{ item.title }}</text>
      </view>
      <view class="menu-item-right">
        <view v-if="item.showDot && item.hasMessage" class="red-dot"></view>
        <image class="arrow-icon" src="/static/my/right.png"></image>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type MenuItem = {
  title: string
  icon: string
  showDot?: boolean
  hasMessage?: boolean
  path?: string
}

const menuItems = ref<MenuItem[]>([
  {
    title: '关注记录',
    icon: '/static/my/follow.png',
    path: '/pagesMy/followRecord/index',
  },
  {
    title: '浏览记录',
    icon: '/static/my/viewHistory.png',
    path: '/pagesMy/viewHistory/index',
  },
  {
    title: '反馈记录',
    icon: '/static/my/feedback.png',
    path: '/pagesMy/feedback/index',
  },
  {
    title: '消息',
    icon: '/static/my/message.png',
    showDot: true,
    hasMessage: true, //小红
    path: '/pagesMy/message/index',
  },
  {
    title: '我的卖房',
    icon: '/static/my/house.png',
    path: '/pagesMy/myHouse/index',
  },
])

const handleMenuClick = (item: MenuItem) => {
  if (item.path) {
    uni.navigateTo({ url: item.path })
  }
}
</script>

<style lang="scss" scoped>
.menu-list {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 38rpx 32rpx 32rpx 38rpx;
  margin: 0 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 120rpx;
    border-bottom: 1rpx solid #f5f5f5;

    &:last-child {
      border-bottom: none;
    }

    .menu-item-left {
      display: flex;
      align-items: center;

      .menu-icon {
        width: 44rpx;
        height: 44rpx;
        margin-right: 24rpx;
      }

      .menu-title {
        font-family: Source Han Sans CN;
        font-weight: 400;
        font-size: 26rpx;
        color: #2e1d40;
      }
    }

    .menu-item-right {
      display: flex;
      align-items: center;
      position: relative;

      .red-dot {
        width: 10rpx;
        height: 10rpx;
        background: #ff0000;
        border-radius: 50%;
        margin-right: 16rpx;
      }

      .arrow-icon {
        width: 9rpx;
        height: 18rpx;
      }
    }
  }
}
</style>
