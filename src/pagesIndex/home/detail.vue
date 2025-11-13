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
        refresher-enabled
        :refresher-triggered="isTriggered"
        @refresherrefresh="onRefresherrefresh"
        class="scroll-view"
        @scroll="onScroll"
        @scrolltolower="handleScrollToLower"
        scroll-y
      >
        <template>
          <!-- 顶部轮播图 -->
          <DetailBanner
            :banners="banners"
            :layout-image="layoutImage"
            :vr-url="vrUrl"
            :video-url="videoUrl"
            @back="back"
            @tab-change="handleTabChange"
          />

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
            <view class="title">推荐</view>
            <ShHomeList :showStats="false" :homeList="homeList" @card-click="handleHomeCardClick" />

            <!-- 加载状态 -->
            <view v-if="isLoadingMore" class="loading-wrapper">
              <text class="loading-text">加载中...</text>
            </view>

            <!-- 没有更多数据 -->
            <view v-else-if="!hasMore && homeList.length > 0" class="no-more">
              <text class="no-more-text">没有更多了</text>
            </view>

            <view class="space"></view>
          </view>
        </template>
      </scroll-view>

      <!-- 悬浮按钮 -->
      <FloatingActions :isFollowed="isFollowed" @follow="handleFollow" @feedback="handleFeedback" />
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
      :phone="currentShareUserMobile"
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
import { onShareAppMessage, onLoad } from '@dcloudio/uni-app'
import type { HomeItem, HouseDetailResult } from '@/types/home'
import DetailBanner from './components/DetailBanner.vue'
import DetailInfoSection from './components/DetailInfoSection.vue'
import FloatingActions from './components/FloatingActions.vue'
import BasicInfoSection, { type InfoItem } from './components/BasicInfoSection.vue'
import SurroundingSection, { type TrafficData } from './components/SurroundingSection.vue'
import PhonePopup from './components/PhonePopup.vue'
import SharePopup from './components/SharePopup.vue'
import SmartLock from './components/SmartLock.vue'
import PosterComponent from './components/PosterComponent.vue'
import { useScrollRefresh } from '@/composables/testUseScroller'
import {
  getHouseDetailAPI,
  getIndexHouseListAPI,
  getToggleFollowAPI,
  type HouseListParams,
} from '@/services/index/page'
import ShHomeList from '@/components/ShHomeList.vue'
import ShNavbar from '@/components/ShNavbar.vue'

// 房源详情数据
const houseDetail = ref<HouseDetailResult>({})

// 媒体数据
const layoutImage = ref('') // 户型图
const vrUrl = ref('') // VR地址
const videoUrl = ref('') // 视频地址

onLoad((option) => {
  if (option?.id) {
    getHouseDetailAPIReq(option.id)
  }
})

// 获取房源详情
const getHouseDetailAPIReq = async (id: string) => {
  try {
    // TODO share_user_id暂无定义
    const params = { id: id, share_user_id: '' }
    const res = await getHouseDetailAPI(params)
    // 保存详情数据
    houseDetail.value = res.data

    // 更新页面数据
    updatePageData(res.data)
  } catch (error) {
    console.error('获取房源详情失败:', error)
    uni.showToast({
      title: '获取房源详情失败',
      icon: 'none',
    })
  }
}

const currentHouseId = ref(0)

// 更新页面数据
const updatePageData = (data: HouseDetailResult) => {
  // 更新轮播图
  if (data.mul_img) {
    try {
      // 如果是 JSON 字符串，解析为数组
      const parsed = typeof data.mul_img === 'string' ? JSON.parse(data.mul_img) : data.mul_img
      if (Array.isArray(parsed) && parsed.length > 0) {
        banners.value = parsed
      }
    } catch (error) {
      console.error('解析轮播图数据失败:', error)
    }
  }

  // 更新户型图
  if (data.room_img) {
    layoutImage.value = data.room_img
    // layoutImage.value =
    //   'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'
  }

  // 更新VR地址
  if (data.vr_url) {
    vrUrl.value = data.vr_url
    // vrUrl.value =
    //   'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'
  }

  // 更新视频地址
  if (data.video_url) {
    videoUrl.value = data.video_url
    // videoUrl.value =
    //   'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop'
  }

  // 更新标题
  const titleParts = []
  if (data.district_title) titleParts.push(String(data.district_title))
  if (data.pharmacist_title) titleParts.push(data.pharmacist_title)
  if (data.exposure_house_title) titleParts.push(data.exposure_house_title)
  if (data.decoration_house_title) titleParts.push(data.decoration_house_title)
  infoTitle.value = titleParts.join('  ')

  // 更新标签 - 将字符串转为数组
  if (data.feature_house_title) {
    // 假设后台返回的是逗号分隔的字符串，如 "地铁房,学区房,精装修"
    tags.value = data.feature_house_title.split(',').filter((tag) => tag.trim())
    selectedTags.value = tags.value.map((_, index) => index)
  }

  // 更新房屋基本信息
  houseInfo.value = {
    totalPrice: data.total_price || '0',
    layout: `${data.style_bedroom || 0}室${data.style_livingroom || 0}厅`,
    area: `${data.house_area || 0}m²`,
    commission: data.commission || '',
  }

  // 构建楼户比例
  const floorHouseholdRatio =
    data.lift_num && data.home_num ? `${data.lift_num}梯${data.home_num}户` : '暂无'

  // 构建详细地址
  const detailAddress =
    data.detail_building || data.detail_unit || data.detail_room
      ? `${data.detail_building || ''}栋${data.detail_unit || ''}单元${data.detail_room || ''}室`
      : '暂无'

  // 更新基本信息列表
  basicInfoList.value = [
    { label: '楼层', value: `${data.now_floor || 0}/${data.total_floor || 0}` },
    { label: '单价', value: `${data.per_price || 0}元/㎡` },
    { label: '类型', value: data.style_house_title || '暂无' },
    { label: '朝向', value: data.exposure_house_title || '暂无' },
    { label: '建筑结构', value: data.structure_house_title || '暂无' },
    { label: '装修', value: data.decoration_house_title || '暂无' },
    { label: '楼户比例', value: floorHouseholdRatio },
    { label: '配备电梯', value: data.lift_house_title || '暂无' },
    { label: '年代', value: data.delivery_date || '暂无' },
    { label: '用途', value: data.use_house_title || '暂无' },
    { label: '户口', value: data.place_house_title || '暂无' },
    { label: '小区', value: data.pharmacist_title || '暂无' },
    { label: '户源编号', value: data.house_code || '暂无' },
    { label: '产权情况', value: data.property_house_title || '暂无' },
    { label: '地址', value: data.address || '暂无', fullWidth: true },
    { label: '详细地址', value: detailAddress, fullWidth: true },
  ]

  // 更新周边配套数据 - 解析交通、教育、医疗、生活信息
  const parseInfo = (info: string | undefined): string[] => {
    if (!info) return []
    // 返回的是换行符分隔的字符串?
    return info.split('\n').filter((item) => item.trim())
  }
  trafficData.value = {
    subway: parseInfo(data.transportation),
    edu: parseInfo(data.education),
    med: parseInfo(data.medical),
    life: parseInfo(data.entertainment),
  }

  // 是否关注
  data.is_follow === 1 ? (isFollowed.value = true) : (isFollowed.value = false)

  // 房源id
  if (data?.id) {
    currentHouseId.value = data.id
  }

  // 电话
  if (data?.share_user_mobile) {
    currentShareUserMobile.value = data.share_user_mobile
  }
}
const currentShareUserMobile = ref('')
const isFollowed = ref(false)
// ============================滚动相关============================================

//============================= 接口请求==============================
const handleHomeCardClick = (item: HomeItem) => {
  uni.navigateTo({
    url: `/pagesIndex/home/detail?id=${item.id}`,
  })
}
const fetchHomeListData = async (page: number): Promise<HomeItem[]> => {
  try {
    const params: HouseListParams = {
      page,
      per_page: 10,
    }
    const res = await getIndexHouseListAPI(params)
    if (res.code === 200) {
      return res.data.list || []
    }
    return []
  } catch (error) {
    return []
  }
}

const {
  list: homeList,
  isLoading: isLoadingMore,
  hasMore,
  isTriggered,
  onRefresherrefresh,
  handleScrollToLower,
} = useScrollRefresh<HomeItem>({
  fetchData: fetchHomeListData,
  pageSize: 10,
  initialPage: 1,
  lowerThreshold: 100,
  enableRefresh: true,
  enableLoadMore: true,
  immediate: true, // 立即加载数据
  onRefreshStart: () => {
    console.log('开始刷新')
  },
  onRefreshEnd: (data) => {
    console.log('刷新完成，获取到数据:', data.length, '条')
  },
  onLoadMoreStart: () => {
    console.log('开始加载更多')
  },
  onLoadMoreEnd: (data) => {
    console.log('加载更多完成，获取到数据:', data.length, '条')
  },
  onError: (error, type) => {
    console.error(`${type} 错误:`, error)
  },
  onEmpty: () => {
    console.log('数据为空')
  },
})

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
      title: infoTitle.value,
      images: banners.value,
      price: houseInfo.value.totalPrice,
      type: houseInfo.value.layout,
      area: houseInfo.value.area,
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
const trafficData = ref<TrafficData>({})

const back = () => {
  uni.navigateBack()
}

const handleTabChange = (key: string) => {
  console.log('切换Tab:', key)
}

const handleTagChange = (selected: number[]) => {
  console.log('标签变化:', selected)
}

const handleFollow = async () => {
  isFollowed.value = !isFollowed.value
  const title = isFollowed.value ? '关注成功' : '取消关注'
  const res = await getToggleFollowAPI(currentHouseId.value)
  uni.showToast({
    title: title,
    icon: 'success',
  })
}

const handleFeedback = () => {
  uni.navigateTo({
    url: '/pagesIndex/home/feedback?id=' + currentHouseId.value,
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
@import '@/uni.scss';
.space {
  height: calc(env(safe-area-inset-bottom));
}
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
  background: #ffffff;
  padding-bottom: 130rpx;

  &.lock-mode {
    background: #ffffff;
  }
}

.tab-content {
  min-height: calc(100vh - 130rpx);
}

.home-list {
  background: #ffffff;
  box-shadow: $uni-box-shadow;
  margin: 18rpx 30rpx 18rpx 30rpx;
  border-radius: 24rpx;
  .title {
    width: 300rpx;
    height: 31rpx;
    font-family: Source Han Sans CN;
    font-weight: bold;
    font-size: 32rpx;
    color: #212121;
    line-height: 54rpx;
    padding: 10rpx 50rpx 60rpx 30rpx;
  }
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

.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.loading-text {
  font-size: 24rpx;
  color: #999;
}

.no-more {
  display: flex;
  justify-content: center;
  padding: 30rpx 0;
}

.no-more-text {
  font-size: 24rpx;
  color: #bfbfbf;
}
</style>
