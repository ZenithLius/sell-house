<script setup lang="ts">
import { ref } from 'vue'
const { safeAreaInsets } = uni.getSystemInfoSync()

const showNavbar = ref(true)

const back = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}

// 用户信息
const userInfo = ref({
  avatar: '/static/customers/share.png',
  name: '钟名白',
  role: '经理',
  phone: '13212345678',
})

// 最近访客列表
const recentVisitors = ref([
  { id: 1, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 2, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 3, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 4, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 5, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 6, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 7, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 8, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 9, name: '沈妮称', phone: '131***1234', date: '2025.09.09' },
  { id: 10, name: '沈妮称11', phone: '131***1234', date: '2025.09.09' },
])

// 分享名片
const shareCard = () => {
  uni.showToast({
    title: '分享名片',
    icon: 'none',
  })
}

// 保存名片
const saveCard = () => {
  uni.showToast({
    title: '保存名片',
    icon: 'none',
  })
}

// 修改信息
const editInfo = () => {
  uni.navigateTo({
    url: '/pagesCustomer/editInfo',
  })
}

// 访客点击
const onVisitorClick = (visitor: any) => {
  console.log('访客点击:', visitor)
}
</script>

<template>
  <view class="customers">
    <ShNavbar @back="back" v-show="showNavbar" :title="'获客'" :showBack="true" />

    <!-- 名片区域 -->
    <view class="card-section">
      <view class="card-container">
        <image class="card-bg" src="/static/customers/cardbackground.png" mode="aspectFill"></image>
        <view class="card-content">
          <image class="avatar" :src="userInfo.avatar" mode="aspectFill"></image>
          <view class="user-info">
            <view class="name-row">
              <text class="name">{{ userInfo.name }}</text>
              <text class="role">{{ userInfo.role }}</text>
            </view>
            <text class="phone">{{ userInfo.phone }}</text>
          </view>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <view class="action-item" @tap="shareCard">
          <image class="action-icon" src="/static/customers/share.png" mode="aspectFit"></image>
          <text class="action-text">分享名片</text>
        </view>
        <view class="action-item" @tap="saveCard">
          <image class="action-icon" src="/static/customers/save.png" mode="aspectFit"></image>
          <text class="action-text">保存名片</text>
        </view>
        <view class="action-item" @tap="editInfo">
          <image class="action-icon" src="/static/customers/edit.png" mode="aspectFit"></image>
          <text class="action-text">修改信息</text>
        </view>
      </view>
    </view>

    <!-- 最近访客区域 -->
    <view class="visitors-section">
      <view class="section-title">最近访客</view>
      <scroll-view class="visitors-list" scroll-y>
        <view
          class="visitor-item"
          v-for="visitor in recentVisitors"
          :key="visitor.id"
          @tap="onVisitorClick(visitor)"
        >
          <view class="visitor-info">
            <text class="visitor-name">{{ visitor.name }}</text>
            <view class="visitor-phone">
              <image class="phone-icon" src="/static/customers/phone.png" mode="aspectFit"></image>
              <text class="phone-text">{{ visitor.phone }}</text>
            </view>
          </view>
          <text class="visitor-date">{{ visitor.date }}</text>
        </view>

        <view class="space" :style="{ height: safeAreaInsets!.bottom + 20 + 'px'}"></view>
      </scroll-view>
    </view>
  </view>
</template>

<style lang="scss">
@import './styles/index.scss';
</style>
