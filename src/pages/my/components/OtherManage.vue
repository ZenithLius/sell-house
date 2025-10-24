<template>
  <view class="other-manage">
    <view class="section-title">其他管理：</view>
    <view class="manage-grid">
      <view class="manage-item" @tap="handleClick('agent')">
        <image class="manage-icon" src="@/static/my/agent.png"></image>
        <text class="manage-text">经纪人</text>
      </view>
      <view class="manage-item" @tap="handleClick('staff')">
        <image class="manage-icon" src="@/static/my/staff.png"></image>
        <text class="manage-text">内部员工</text>
      </view>
      <view class="manage-item" @tap="handleClick('manager')">
        <image class="manage-icon" src="@/static/my/manager.png"></image>
        <text class="manage-text">片区经理</text>
      </view>
      <view class="manage-item" @tap="handleClick('investment')">
        <image class="manage-icon" src="@/static/my/Investment.png"></image>
        <text class="manage-text">投资人</text>
      </view>
      <view class="manage-item" @tap="handleClick('renovation')">
        <image class="manage-icon" src="@/static/my/renovation.png"></image>
        <text class="manage-text">房屋装修</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const handleClick = (type: string) => {
  uni.navigateTo({ url: `/pagesMy/authentication/index?type=${type}` })
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
