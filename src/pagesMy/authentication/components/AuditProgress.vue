<template>
  <view class="container">
    <view class="audit-progress">
      <view class="title">审核进度：</view>

      <view v-if="completionAudit" class="audit-item">
        <view class="audit-info">
          <view class="audit-label">完工审核：</view>
          <text class="audit-status">{{ completionAudit.status }}</text>
          <text class="audit-time">{{ completionAudit.time }}</text>
        </view>
        <view class="audit-info">
          <text class="audit-label">审核人：</text>
          <text class="audit-status">{{ completionAudit.auditor }}</text>
        </view>
      </view>

      <view v-if="paymentAudit" class="audit-item">
        <view class="audit-info">
          <view class="audit-label">支付审核：</view>
          <text class="audit-status">{{ paymentAudit.status }}</text>
          <text class="audit-time">{{ paymentAudit.time }}</text>
        </view>
        <view class="audit-info">
          <text class="audit-label">审核人：</text>
          <text class="audit-status">{{ paymentAudit.auditor }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface AuditInfo {
  status: string
  time: string
  auditor: string
}

interface Props {
  completionAudit?: AuditInfo
  paymentAudit?: AuditInfo
}

withDefaults(defineProps<Props>(), {
  completionAudit: undefined,
  paymentAudit: undefined,
})
</script>

<style lang="scss" scoped>
.container {
  padding: 25rpx;
  background: #fff;
}
.audit-progress {
  background: #f5f5f5;
  border-radius: 16rpx;
  margin-top: 20rpx;
  padding: 18rpx;

  .title {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 24rpx;
    color: #030509;
    line-height: 42rpx;
    padding-bottom: 20rpx;
  }

  .audit-item {
    background: #f5f5f5;
    border-radius: 12rpx;
    padding: 24rpx 24rpx 24rpx 0rpx;

    margin-bottom: 24rpx;
    border-top: 1px solid #e8e8e8;

    &:last-child {
      margin-bottom: 0;
    }

    .audit-label {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 24rpx;
      color: #908c94;
      line-height: 42rpx;
      white-space: nowrap;
      width: 118rpx;
      text-align: end;
    }

    .audit-info {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;

      .audit-status {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 24rpx;
        color: #030509;
        line-height: 42rpx;
      }

      .audit-time {
        font-family: Source Han Sans CN;
        font-weight: 500;
        font-size: 24rpx;
        color: #030509;
        line-height: 42rpx;
        margin-left: 15rpx;
      }
    }
  }
}
</style>
