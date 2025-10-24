<template>
  <view class="sell-board">
    <!-- 背景图 -->
    <image class="board-bg" src="/static/index/board.png" mode="aspectFill"></image>
    <!-- 顶部标题栏 -->
    <view class="board-header">
      <view class="header-left">
        <image class="icon-logo" src="/static/index/littleLogo.png" mode="aspectFit"></image>
        <text class="title">帮卖房公告</text>
      </view>
      <view class="header-right">
        <text class="more-text">更多</text>
        <image class="icon-triangle" src="/static/index/triangle.png" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="board-content">
      <text class="content-text">保障租赁住房通知内容文字详情介绍...</text>
    </view>
  </view>
</template>

<script setup lang="ts">
// 组件逻辑
</script>

<style lang="scss" scoped>
@import '../styles/board.scss';
</style>
