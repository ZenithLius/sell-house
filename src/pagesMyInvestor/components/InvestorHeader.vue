<script setup lang="ts">
const props = defineProps({
  userName: {
    type: String,
    default: '张三',
  },
  totalRevenue: {
    type: Number,
    default: 0,
  },
  totalInvestment: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits<{ detail: [] }>()

const handleDetail = () => {
  uni.navigateTo({
    url: '/pagesMyInvestor/incomeStatement',
  })
}

const formatMoney = (num: number) => {
  return num.toFixed(2).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}
</script>

<template>
  <view class="investor-header">
    <view class="header-card">
      <image class="card-bg" src="@/pagesMyInvestor/static/indexBg.png" mode="aspectFill"></image>
      <view class="card-content">
        <view class="card-top">
          <view class="left-content">
            <view class="user-label">{{ userName }}-收益</view>
            <view class="total-amount">{{ formatMoney(totalRevenue) }}</view>
          </view>
          <view class="detail-btn" @tap="handleDetail">收益明细</view>
        </view>

        <view class="card-bottom">
          <view class="info-item">
            <view class="info-label">投资总金额</view>
            <view class="info-value">¥{{ formatMoney(totalInvestment) }}</view>
          </view>
          <view class="info-item">
            <view class="info-label">投资余额</view>
            <view class="info-value">{{ formatMoney(balance) }}</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.investor-header {
  padding: 30rpx;

  .header-card {
    position: relative;
    height: 358rpx;
    border-radius: 20rpx;
    overflow: hidden;

    .card-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .card-content {
      position: relative;
      z-index: 1;
      height: 100%;
      padding: 40rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .left-content {
        display: flex;
        flex-direction: column;
        gap: 20rpx;

        .user-label {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 24rpx;
          color: #ffffff;
          line-height: 42rpx;
        }

        .total-amount {
          font-family: Arial;
          font-weight: 400;
          font-size: 64rpx;
          color: #ffffff;
        }
      }

      .detail-btn {
        background: rgba(65, 2, 129, 0.26) !important;
        width: 145rpx;
        height: 64rpx;
        background: #410281;
        border-radius: 32rpx;
        border: 1px solid #ffffff;
        font-weight: 400;
        font-size: 26rpx;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 68rpx;

      .info-item {
        flex: 1;

        .info-label {
          font-family: Source Han Sans CN;
          font-weight: 400;
          font-size: 24rpx;
          color: #ffffff;
          line-height: 42rpx;
        }

        .info-value {
          font-family: Adobe Heiti Std;
          font-weight: normal;
          font-size: 34rpx;
          color: #ffffff;
          line-height: 62rpx;
        }
      }
    }
  }
}
</style>
