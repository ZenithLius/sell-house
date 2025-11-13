<template>
  <view class="btns">
    <view class="agreement">
      <checkbox-group @change="handleAgreementChange">
        <label class="agreement-label">
          <checkbox :checked="agreedToTerms" color="#863fce" />
          <text class="agreement-text">
            我已阅读协议
            <text class="link" @click.stop="handleViewAgreement">《注册协议》</text>
          </text>
        </label>
      </checkbox-group>
    </view>
    <button class="submit-btn" @click="handleSubmit">立即提交</button>
    <text class="tips">等待平台审核</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  agreedToTerms: boolean
}>()

const emit = defineEmits<{
  (e: 'update:agreedToTerms', value: boolean): void
  (e: 'view-agreement'): void
  (e: 'submit'): void
}>()

const handleAgreementChange = (event: any) => {
  emit('update:agreedToTerms', event.detail.value.length > 0)
}

const handleViewAgreement = () => {
  uni.navigateTo({
    url: `/pagesMy/agreement/index?id=${24}`,
  })
}

const handleSubmit = () => {
  emit('submit')
}
</script>

<style lang="scss" scoped>
.btns {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 32rpx;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  z-index: 1;

  .agreement {
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12rpx;

    .agreement-label {
      display: flex;
      align-items: center;
      gap: 12rpx;
    }

    .agreement-text {
      font-size: 26rpx;
      color: #666;
      display: flex;
      align-items: center;
      flex-wrap: wrap;

      .link {
        color: #863fce;
        text-decoration: none;
      }
    }
  }

  .submit-btn {
    width: 532rpx;
    height: 80rpx;
    background: #863fce;
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 31rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 35rpx;

    &::after {
      border: none;
    }
  }

  .tips {
    display: block;
    text-align: center;
    font-size: 24rpx;
    color: #999;
  }
}
</style>
