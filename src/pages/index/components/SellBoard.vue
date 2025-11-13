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
      <view class="header-right" @tap="handleMore">
        <text class="more-text">更多</text>
        <image class="icon-triangle" src="/static/index/triangle.png" mode="aspectFit"></image>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="board-content">
      <swiper
        v-if="noticeList.length > 0"
        class="notice-swiper"
        :vertical="true"
        :circular="true"
        :autoplay="true"
        :interval="3000"
        :duration="500"
      >
        <swiper-item v-for="item in noticeList" :key="item.id" class="swiper-item">
          <text class="content-text">{{ item.title }}</text>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getNoticeListAPI } from '@/services/index/page'
import type { NoticeItem } from '@/types/home'

const handleMore = () => {
  uni.switchTab({ url: '/pages/consult/index' })
}

const noticeList = ref<NoticeItem[]>([])

// 获取公告列表
const getNoticeList = async () => {
  const res = await getNoticeListAPI()
  if (res.code === 200) {
    noticeList.value = res.data
  } else {
    uni.showToast({
      title: '获取公告列表失败',
      icon: 'none',
    })
  }
}

getNoticeList()
</script>

<style lang="scss" scoped>
@import '../styles/board.scss';
</style>
