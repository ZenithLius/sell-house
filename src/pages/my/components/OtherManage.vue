<template>
  <view class="other-manage">
    <view class="section-title">其他管理：</view>
    <view class="manage-grid">
      <view
        v-for="item in manageItems"
        :key="item.type"
        class="manage-item"
        @tap="handleClick(item.type)"
      >
        <image class="manage-icon" :src="item.icon"></image>
        <text class="manage-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import agentIcon from '/static/my/agent.png'
import staffIcon from '/static/my/staff.png'
import managerIcon from '/static/my/manager.png'
import investmentIcon from '/static/my/Investment.png'
import renovationIcon from '/static/my/renovation.png'

// 管理项配置
const manageItems = [
  { type: 'agent', icon: agentIcon, text: '经纪人' },
  { type: 'staff', icon: staffIcon, text: '内部员工' },
  { type: 'manager', icon: managerIcon, text: '片区经理' },
  { type: 'investment', icon: investmentIcon, text: '投资人' },
  { type: 'renovation', icon: renovationIcon, text: '房屋装修' },
]

// 路由配置映射表
const ROUTE_MAP: Record<string, string> = {
  agent: '/pagesMy/authentication/index',
  staff: '/pagesMy/authentication/index',
  manager: '/pagesMy/manage/index',
  investment: '/pagesMyInvestor/index',
  renovation: '/pagesRenovation/index',
}

const handleClick = (type: string) => {
  uni.setStorage({
    key: 'currentOtherManageType',
    data: type,
  })

  const path = ROUTE_MAP[type]
  if (path) {
    uni.navigateTo({ url: `${path}?type=${type}` })
    uni.setStorageSync('currentMyHouseSourceTab', 'myHouse')
  }
}
</script>

<style lang="scss" scoped>
.other-manage {
  margin: 40rpx 30rpx;
  padding: 32rpx 32rpx 24rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);

  .section-title {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #181a1e;
    line-height: 38rpx;
    margin-bottom: 32rpx;
  }

  .manage-grid {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .manage-item {
      width: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 32rpx;

      .manage-icon {
        width: 44rpx;
        height: 54rpx;
        margin-bottom: 16rpx;
      }

      .manage-text {
        font-family: Source Han Sans CN;
        font-weight: 400;
        font-size: 22rpx;
        color: #362b40;
      }
    }
  }
}
</style>
