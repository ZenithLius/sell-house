<script setup lang="ts">
import type { BannerItem, CategoryItem } from '@/types/home'
import { onLoad } from '@dcloudio/uni-app'
import { nextTick, ref } from 'vue'
import CategoryPanel from './components/CategoryPanel.vue'
import SellBoard from './components/SellBoard.vue'
import FilterList from './components/FilterList.vue'
import HomeList from './components/HomeList.vue'
import { useGuessList } from '@/composables'
import ShSearchBar from '@/components/ShSearchBar.vue'
const { safeAreaInsets } = uni.getSystemInfoSync()

const bannerList = ref<BannerItem[]>([
  {
    id: '1',
    imgUrl: '/static/images/navigator_bg.png',
    hrefUrl: '/pages/index/index',
    type: 1,
  },
])
const getHomeBannerData = async () => {
  // const res = await getHomeBannerAPI()
  // bannerList.value = res.result
}

// 获取房源分类
const categoryList = ref<CategoryItem[]>([
  {
    id: '1',
    name: '我要卖房',
    icon: '/static/index/sellHouse.png',
  },
  {
    id: '2',
    name: '我的房源',
    icon: '/static/index/houseSource.png',
  },
  {
    id: '3',
    name: '资讯',
    icon: '/static/index/news.png',
  },
  {
    id: '4',
    name: '我的订单',
    icon: '/static/index/order.png',
  },
])

// 是否加载中标记
const isLoading = ref(false)

// 页面加载
onLoad(async () => {
  isLoading.value = true
  await Promise.all([getHomeBannerData(), categoryList.value])
  isLoading.value = false
})

// 猜你喜欢组合式函数调用
const { guessRef, onScrolltolower } = useGuessList()
// 当前下拉刷新状态
const isTriggered = ref(false)
// 筛选抽屉是否打开，用于锁定页面滚动
const isFilterDrawerOpen = ref(false)
// 导航栏显示状态
const showNavbar = ref(false)
// 记录滚动位置
const scrollTop = ref(0)
// 程序控制的滚动位置（用于小程序在打开抽屉时回到顶部，避免抽屉被裁剪）
const programmaticScrollTop = ref(0)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  // 开始动画
  isTriggered.value = true
  // 加载数据
  // await getHomeBannerData()
  // await getHomeCategoryData()
  // await getHomeHotData()
  // 重置猜你喜欢组件数据
  guessRef.value?.resetData()
  await Promise.all([
    getHomeBannerData(),
    categoryList.value,
    // getHomeHotData(),
    guessRef.value?.getMore(),
  ])
  // 关闭动画
  isTriggered.value = false
}

// 处理滚动事件
const onScroll = (e: any) => {
  const currentScrollTopHeight = e.detail.scrollTop
  currentScrollTop.value = e.detail.scrollTop

  // 小于50px
  if (currentScrollTopHeight <= 50) {
    showNavbar.value = false
  } else {
    // 向上滚动，显示导航栏
    showNavbar.value = true
  }

  scrollTop.value = currentScrollTopHeight
}

const currentScrollTop = ref(0)

// 处理抽屉状态变化
const handleDrawerChange = (visible: boolean) => {
  isFilterDrawerOpen.value = visible
  showNavbar.value = false

  if (visible) {
    programmaticScrollTop.value = Math.random() // 触发滚动
    nextTick(() => {
      programmaticScrollTop.value = 0
    })
  }
}

const back = () => {
  uni.navigateBack()
}
</script>

<template>
  <view class="viewport">
    <!-- 自定义导航栏 -->
    <ShNavbar
      @back="back"
      v-show="showNavbar"
      :title="'首页'"
      :showBack="false"
      class="navbar-fixed"
    />

    <!-- 滚动容器 -->
    <scroll-view
      enable-back-to-top
      :refresher-enabled="!isFilterDrawerOpen"
      @refresherrefresh="onRefresherrefresh"
      :refresher-triggered="isTriggered"
      @scrolltolower="onScrolltolower"
      class="scroll-view"
      @scroll="onScroll"
      :scroll-y="!isFilterDrawerOpen"
      :scroll-top="programmaticScrollTop"
    >
      <!-- <PageSkeleton v-if="isLoading" /> -->
      <template>
        <!-- 轮播图容器 -->
        <view class="banner-container">
          <!-- 自定义轮播图 -->
          <ShSwiper :list="bannerList" />
          <!-- 悬浮的导航栏 -->
          <view
            class="floating-navbar"
            :style="{ paddingTop: (safeAreaInsets?.top || 0) + 10 + 'px' }"
          >
            <view class="logo">
              <image class="logo-image" src="@/static/images/logo.png"></image>
            </view>
            <!-- 搜索条 -->
            <ShSearchBar />
          </view>
        </view>
        <!-- 分类面板 -->
        <CategoryPanel :list="categoryList" />
        <!-- 卖房公告 -->
        <SellBoard />
        <!-- 筛选功能 -->
        <FilterList @drawer-change="handleDrawerChange" />
        <!-- 房子信息list -->
        <HomeList />
      </template>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  background-color: #f7f7f7;
  height: 100%;
  overflow: hidden;
}

.viewport {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.position {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #fff;
  padding: 10rpx;
  text-align: center;
}

.scroll-view {
  flex: 1;
  overflow: hidden;
}

.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.banner-container {
  position: relative;
}

.floating-navbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    .logo-image {
      width: 166rpx;
      height: 39rpx;
    }
  }
}
</style>
