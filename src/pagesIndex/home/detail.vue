<template>
  <view class="detail-page" :class="{ 'lock-mode': currentTab === 'lock' }">
    <!-- 自定义导航栏 -->
    <ShNavbar
      @back="handleBack"
      v-show="showNavbar"
      :title="title"
      :showBack="showBack"
      class="navbar-fixed"
    />
    <!-- 首页tab内容 -->
    <view v-show="currentTab !== 'lock'" class="tab-content">
      <scroll-view
        enable-back-to-top
        @refresherrefresh="onRefresherrefresh"
        :refresher-triggered="isTriggered"
        class="scroll-view"
        @scroll="onScroll"
        scroll-y
      >
        <template>
          <!-- 顶部轮播图 -->
          <DetailBanner :banners="banners" @back="back" @tab-change="handleTabChange" />

          <!-- 信息头部详情 -->
          <DetailInfoSection
            :title="infoTitle"
            :tags="tags"
            :house-info="houseInfo"
            :initial-selected-tags="selectedTags"
            @tag-change="handleTagChange"
          />

          <!-- 基本信息 -->
          <BasicInfoSection :title="basicInfoTitle" :info-list="basicInfoList" />

          <!-- 周边配套 -->
          <SurroundingSection :traffic-data="trafficData" />

          <!-- 推荐房源信息列表 -->
          <view class="home-list">
            <ShHomeList :showStats="false" />
          </view>
        </template>
      </scroll-view>

      <!-- 悬浮按钮 -->
      <FloatingActions @follow="handleFollow" @feedback="handleFeedback" />
    </view>

    <!-- 智能锁tab内容 -->
    <view v-show="currentTab === 'lock'" class="tab-content lock-content">
      <view class="content-placeholder">
        <SmartLock @unlock="handleBluetoothUnlock" @password-unlock="handlePasswordUnlock" />
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="bottom-tabbar">
      <view
        v-for="tab in tabList"
        :key="tab.key"
        class="tab-item"
        :class="{ active: currentTab === tab.key }"
        @tap="switchTab(tab.key)"
      >
        <image
          :src="currentTab === tab.key ? tab.activeIcon : tab.icon"
          class="tab-icon"
          mode="aspectFit"
        />
        <text class="tab-text">{{ tab.text }}</text>
      </view>
    </view>

    <!-- 电话弹窗 -->
    <PhonePopup
      ref="phonePop"
      name="李三"
      phone="13212345678"
      @confirm="handlePhoneCall"
      @cancel="handlePhoneCancel"
    />

    <!-- 分享弹窗 -->
    <SharePopup ref="sharePop" @share="handleShare" />

    <!-- 海报组件 -->
    <PosterComponent ref="posterRef" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import DetailBanner from './components/DetailBanner.vue'
import DetailInfoSection from './components/DetailInfoSection.vue'
import FloatingActions from './components/FloatingActions.vue'
import BasicInfoSection, { type InfoItem } from './components/BasicInfoSection.vue'
import SurroundingSection, { type TrafficData } from './components/SurroundingSection.vue'
import PhonePopup from './components/PhonePopup.vue'
import SharePopup from './components/SharePopup.vue'
import SmartLock from './components/SmartLock.vue'
import PosterComponent from './components/PosterComponent.vue'

// 配置微信小程序分享
onShareAppMessage(() => {
  return {
    title: infoTitle.value || '推荐一套好房给你',
    path: `/pagesIndex/home/detail?id=123`, // 分享路径，可以带参数
    imageUrl: banners.value[0] || '', // 分享图片，使用第一张轮播图
  }
})

const handleBack = () => {
  if (currentTab.value === 'lock') {
    currentTab.value = 'empty'
    return
  }
  uni.navigateBack()
}
// =========================滚动区域=========================
// 当前下拉刷新状态
const isTriggered = ref(false)
// 自定义下拉刷新被触发
const onRefresherrefresh = async () => {
  console.log('下拉刷新')
}

// 底部tab配置
type TabKey = 'home' | 'phone' | 'share' | 'lock' | 'empty'

interface TabItem {
  key: TabKey
  text: string
  icon: string
  activeIcon: string
}

const currentTab = ref<TabKey>('empty')

const tabList = ref<TabItem[]>([
  {
    key: 'home',
    text: '首页',
    icon: '/static/tabs/indexPage.png',
    activeIcon: '/static/tabs/indexPageActive.png',
  },
  {
    key: 'phone',
    text: '电话',
    icon: '/static/index/phone.png',
    activeIcon: '/static/index/phoneActive.png',
  },
  {
    key: 'share',
    text: '分享',
    icon: '/static/index/share.png',
    activeIcon: '/static/index/shareActive.png',
  },
  {
    key: 'lock',
    text: '智能锁',
    icon: '/static/index/lock.png',
    activeIcon: '/static/index/lockActive.png',
  },
])

// 导航栏显示状态
const showNavbar = ref(false)

const onScroll = (e: any) => {
  console.log('滚动', e)
  const currentScrollTopHeight = e.detail.scrollTop
  // 小于50px
  if (currentScrollTopHeight <= 50) {
    showNavbar.value = false
  } else {
    // 向上滚动，显示导航栏
    showNavbar.value = true
  }
}

const phonePop = ref<{ open: () => void; close: () => void } | null>(null)
const sharePop = ref<{ open: () => void; close: () => void } | null>(null)

const handlePhoneCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone,
  })
}

const handlePhoneCancel = () => {
  phonePop.value?.close()
  currentTab.value = 'home'
}
const posterRef = ref()
const handleShare = (type: 'wechat' | 'download') => {
  currentTab.value = 'home'
  if (type === 'wechat') {
    // 微信分享由 button open-type="share" 和 onShareAppMessage 处理
    // 这里只需要关闭弹窗即可，分享面板会自动弹出
    sharePop.value?.close()
  } else if (type === 'download') {
    uni.downloadFile({
      url: 'https://example.com/image1.jpg',
      success: (res) => {
        console.log('下载成功', res)
      },
      fail: (err) => {
        console.log('下载失败', err)
      },
    })

    uni.showToast({
      title: '下载海报',
      icon: 'none',
    })
    const posterData = {
      title: '封闭小区高档社区 简装 近地铁站方便...',
      images: [
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      ],
      price: '150万',
      type: '二室一厅',
      area: '155-188㎡',
      year: '2014年',
      purpose: '用途',
      status: '刚需',
      qrcode: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    }

    // 打开海报
    posterRef.value.openPoster(posterData)
  }
}
const title = ref('首页')
const showBack = ref(true)
const switchTab = (key: TabKey) => {
  currentTab.value = key

  switch (key) {
    case 'home':
      uni.navigateBack()
      break
    case 'phone':
      // 拨打电话
      // uni.makePhoneCall({
      //   phoneNumber: '10086111',
      // })
      sharePop.value?.close()
      phonePop.value?.open()
      title.value = '首页'

      break
    case 'share':
      // 分享功能
      phonePop.value?.close()
      sharePop.value?.open()
      title.value = '首页'

      break
    case 'lock':
      title.value = '申请开锁'
      showNavbar.value = true
      phonePop.value?.close()
      sharePop.value?.close()
      break
  }
}

// 轮播图数据
const banners = ref<string[]>([
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop',
])

// 标题
const infoTitle = ref('未央区  天朗御湖  西南朝向  精装修')

// 标签数据
const tags = ref(['婚房首选', '经典两室', '精装拎包入住', '婚房首选', '经典两室', '精装拎包入住'])
const selectedTags = ref<number[]>([0, 1, 2, 3, 4, 5]) // 已选中的标签索引

// 房屋基本信息
const houseInfo = ref({
  totalPrice: '55.8', // 总价（万）
  layout: '二室一厅', // 户型
  area: '155-188m²', // 建面
  commission: '中介费1.5% + 5000.00', // 中介费
})

// 基本信息
const basicInfoTitle = ref('基本信息')
const basicInfoList = ref<InfoItem[]>([
  { label: '楼层', value: '6/33' },
  { label: '单价', value: '12734元/㎡' },
  { label: '类型', value: '高层' },
  { label: '朝向', value: '西南' },
  { label: '建筑结构', value: '框架' },
  { label: '装修', value: '精装修' },
  { label: '楼户比例', value: '2梯6户' },
  { label: '配备电梯', value: '有' },
  { label: '年代', value: '2014年' },
  { label: '用途', value: '刚需' },
  { label: '户口', value: '无' },
  { label: '小区', value: '天朗御湖' },
  { label: '户源编号', value: '620038' },
  { label: '产权情况', value: '满二' },
  { label: '地址', value: '陕西省西安市未央区汉城街道天朗·御湖', fullWidth: true },
  { label: '详细地址', value: '10栋2单元302室', fullWidth: true },
])

// 周边配套数据
const trafficData = ref<TrafficData>({
  subway: ['距离地铁4号线文景路站约700米', '距离地铁2号线行政中心站约1800米'],
  bus: [
    '周边2公里内有53个公交站，如凤城八路民经一路口、凤城七路经开璟程酒店等，可乘坐228路、236路等',
  ],
})

const back = () => {
  uni.navigateBack()
}

const handleTabChange = (key: string) => {
  console.log('切换Tab:', key)
}

const handleTagChange = (selected: number[]) => {
  console.log('标签变化:', selected)
}

const handleFollow = () => {
  console.log('关注')
  uni.showToast({
    title: '关注成功',
    icon: 'success',
  })
}

const handleFeedback = () => {
  console.log('反馈')
  uni.navigateTo({
    url: '/pagesIndex/home/feedback',
  })
}

const handleBluetoothUnlock = () => {
  uni.showToast({
    title: '蓝牙开锁中...',
    icon: 'loading',
    duration: 2000,
  })
  setTimeout(() => {
    uni.showToast({
      title: '开锁成功',
      icon: 'success',
    })
  }, 2000)
}

const handlePasswordUnlock = () => {
  uni.showToast({
    title: '密码开锁',
    icon: 'none',
  })
}
</script>

<style lang="scss" scoped>
.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  animation: slideDown 0.3s ease-out;
}
.detail-page {
  min-height: 100vh;
  background: #f7f8fc;
  padding-bottom: 130rpx;

  &.lock-mode {
    background: #ffffff;
  }
}

.tab-content {
  min-height: calc(100vh - 130rpx);
}

.home-list {
  padding: 39rpx 1rpx 39rpx 1rpx;
  background: #ffffff;
  border-radius: 24rpx;
  margin: 30rpx;
}

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .placeholder-text {
    font-size: 32rpx;
    color: #999;
  }
}

.scroll-view {
  height: calc(100vh - 130rpx);
  width: 100%;
}

.bottom-tabbar {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) - 5rpx);
  left: 0;
  right: 0;
  height: 100rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  // padding-bottom: env(safe-area-inset-bottom);
  z-index: 1;

  .tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    // padding: 10rpx 0;
    margin: 15rpx 0;

    .tab-icon {
      width: 41rpx;
      height: 41rpx;
      margin-bottom: 6rpx;
    }

    .tab-text {
      font-size: 22rpx;
      color: #333;
      transition: color 0.3s;
    }

    &.active {
      .tab-text {
        color: #7c3aed;
        font-weight: 500;
      }
    }
  }
}
</style>
