<script setup lang="ts">

import { ref } from 'vue'
interface Props {
  //暂时控制，浏览数据，佣金。房价上涨等
  showStats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true,
})

// 房源数据类型
interface HomeItem {
  id: number
  image: string
  title: string
  tags: string[]
  area: string
  layout: string
  floor: string
  district: string
  price: number
  unitPrice: number
  views: number
  favorites: number
  consults: number
  appointments: number
  commission: string
}

const homeList = ref<HomeItem[]>([
  {
    id: 1,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_1.jpg',
    title: '封闭小区高档社区 简装 近公园 交通便利',
    tags: ['婚房首选', '经典两室', '精装拎包入住'],
    area: '89',
    layout: '2室2厅',
    floor: '低楼层',
    district: '费费小区',
    price: 55.8,
    unitPrice: 7585,
    views: 471,
    favorites: 6,
    consults: 29,
    appointments: 30,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 2,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_2.jpg',
    title: '豪华装修三居室 视野开阔 配套齐全',
    tags: ['豪华装修', '视野开阔', '配套齐全'],
    area: '128',
    layout: '3室2厅',
    floor: '高楼层',
    district: '阳光花园',
    price: 89.9,
    unitPrice: 7023,
    views: 523,
    favorites: 12,
    consults: 45,
    appointments: 28,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 3,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_3.jpg',
    title: '温馨小户型 地铁口 生活便利',
    tags: ['地铁口', '温馨装修', '生活便利'],
    area: '65',
    layout: '1室1厅',
    floor: '中楼层',
    district: '地铁新城',
    price: 42.5,
    unitPrice: 6538,
    views: 389,
    favorites: 8,
    consults: 32,
    appointments: 19,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 4,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_4.jpg',
    title: '学区房 名校旁 适合家庭居住',
    tags: ['学区房', '名校旁', '家庭首选'],
    area: '105',
    layout: '3室1厅',
    floor: '中楼层',
    district: '书香苑',
    price: 78.6,
    unitPrice: 7486,
    views: 612,
    favorites: 25,
    consults: 68,
    appointments: 42,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 5,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_5.jpg',
    title: '江景房 采光极佳 南北通透',
    tags: ['江景房', '采光好', '南北通透'],
    area: '142',
    layout: '4室2厅',
    floor: '高楼层',
    district: '江畔豪庭',
    price: 125.8,
    unitPrice: 8859,
    views: 758,
    favorites: 35,
    consults: 89,
    appointments: 56,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 6,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_6.jpg',
    title: '精品公寓 拎包入住 投资自住两相宜',
    tags: ['精品公寓', '拎包入住', '投资佳选'],
    area: '58',
    layout: '1室1厅',
    floor: '低楼层',
    district: '都市公寓',
    price: 38.8,
    unitPrice: 6690,
    views: 425,
    favorites: 15,
    consults: 38,
    appointments: 22,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 7,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_7.jpg',
    title: '复式楼 空间大 适合大家庭',
    tags: ['复式楼', '空间大', '大家庭'],
    area: '186',
    layout: '5室3厅',
    floor: '顶楼',
    district: '御景华府',
    price: 168.0,
    unitPrice: 9032,
    views: 892,
    favorites: 48,
    consults: 102,
    appointments: 65,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 8,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_8.jpg',
    title: '商住两用 楼下商铺 楼上住宅',
    tags: ['商住两用', '投资优选', '双重收益'],
    area: '95',
    layout: '2室2厅',
    floor: '低楼层',
    district: '商业广场',
    price: 72.5,
    unitPrice: 7632,
    views: 536,
    favorites: 18,
    consults: 52,
    appointments: 31,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 9,
    image: 'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_9.jpg',
    title: '新房源 刚需首选 价格实惠',
    tags: ['新房源', '刚需首选', '价格实惠'],
    area: '78',
    layout: '2室1厅',
    floor: '中楼层',
    district: '幸福家园',
    price: 48.9,
    unitPrice: 6269,
    views: 356,
    favorites: 9,
    consults: 26,
    appointments: 18,
    commission: '中介费1.5% + 5000.00',
  },
  {
    id: 10,
    image:
      'https://pcapi-xiaotuxian-front-devtest.itheima.net/miniapp/uploads/goods_preview_10.jpg',
    title: '老城区 配套成熟 生活方便',
    tags: ['配套成熟', '生活方便', '老城区'],
    area: '92',
    layout: '2室2厅',
    floor: '低楼层',
    district: '老城花园',
    price: 52.6,
    unitPrice: 5717,
    views: 467,
    favorites: 11,
    consults: 34,
    appointments: 25,
    commission: '中介费1.5% + 5000.00',
  },
])

// 加载状态
const loading = ref(false)
const finished = ref(false)

// TODO:触底加载更多
const onLoadMore = () => {
  if (loading.value || finished.value) return

  loading.value = true
  console.log('触底加载更多数据...')

  // TODO: 调用接口加载更多数据
  setTimeout(() => {
    loading.value = false
    // finished.value = true // 没有更多数据时设置为 true
  }, 1000)
}

// todo:下拉刷新
const onRefresh = () => {
  console.log('下拉刷新数据...')
}

// 点击房源卡片
const handleCardClick = (item: HomeItem) => {
  // TODO: 跳转到房源详情页
  uni.navigateTo({
    url: `/pagesIndex/home/detail?id=${item.id}`,
  })
}
</script>

<template>
  <view class="home-list">
    <view v-for="item in homeList" :key="item.id" class="home-card" @tap="handleCardClick(item)">
      <view class="top">
        <!-- 房源图片 -->
        <image class="home-image" :src="item.image" mode="aspectFill"></image>
        <!-- 房源信息 -->
        <view class="home-info">
          <!-- 标题 -->
          <text class="home-title">{{ item.title }}</text>

          <!-- 基本信息 -->
          <view class="home-basic">
            <text class="basic-item">{{ item.layout }}</text>
            <text class="basic-item">{{ item.area }}m²</text>
            <text class="basic-item">{{ item.floor }}</text>
            <text class="basic-item">{{ item.district }}</text>
          </view>

          <!-- 标签 -->
          <view class="home-tags">
            <text v-for="(tag, index) in item.tags" :key="index" class="tag-item">
              {{ tag }}
            </text>
          </view>

          <!-- 价格 -->
          <view class="home-price">
            <text class="price-main">{{ item.price }}万</text>
            <image
              v-if="!showStats"
              class="down-icon"
              src="/static/index/downGreen.png"
              mode="aspectFit"
            ></image>
            <text class="price-unit">{{ item.unitPrice }}元/m²</text>
          </view>
        </view>
      </view>
      <view class="bottom">
        <!-- 统计信息 -->
        <view class="home-stats" v-if="showStats">
          <text class="stat-item">浏览 {{ item.views }}次</text>
          <text class="stat-item">关注 {{ item.favorites }}人</text>
          <text class="stat-item">咨询 {{ item.consults }}次</text>
          <text class="stat-item">带看 {{ item.appointments }}次</text>
        </view>

        <!-- 中介费 -->
        <view class="home-commission" v-if="showStats">
          <image
            class="commission-icon"
            src="/static/images/commission.png"
            mode="aspectFit"
          ></image>
          <text class="commission-text">{{ item.commission }}</text>
        </view>
      </view>
    </view>

    <!-- 加载状态 -->
    <view v-if="loading" class="loading-more">加载中...</view>
    <view v-if="finished" class="no-more">没有更多了</view>
  </view>
</template>

<style lang="scss" scoped>
.home-list {
  padding: 0 32rpx;
}

.home-card {
  display: flex;

  flex-direction: column;
  border-radius: 16rpx;
  overflow: hidden;
  // margin-bottom: 24rpx;

  .top {
    display: flex;
    height: 240rpx;
  }
  .bottom {
    display: flex;
    flex-direction: column;
    .home-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 12rpx;
      column-gap: 20rpx;
      margin-left: -15rpx;

      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 22rpx;
      color: #908c94;
      line-height: 42rpx;
      background: #f8fafa;
      // margin-top: 24rpx;
    }
    .home-commission {
      display: flex;
      align-items: center;
      gap: 8rpx;
      margin-left: 15rpx;
      margin-top: 10rpx;
      margin-bottom: 24rpx;
    }
  }

  &:active {
    opacity: 0.9;
  }
}

.home-image {
  width: 206rpx;
  height: 208rpx;
  flex-shrink: 0;
  // margin-top: 30rpx;
  border-radius: 10rpx;
  // margin-left: 30rpx;
}

.home-info {
  flex: 1;
  padding: 0rpx 20rpx 0rpx 20rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.home-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 30rpx;
  color: #030509;
  line-height: 38rpx;
  text-overflow: ellipsis;
  margin-bottom: 12rpx;
}

.home-basic {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.basic-item {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #030509;
  line-height: 42rpx;
}

.home-tags {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 12rpx;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 22rpx;
  color: #7b678f;
  background-color: #f7f5fa;
  padding: 4rpx 12rpx;
  font-weight: 400;
  border-radius: 4rpx;
}

.home-price {
  display: flex;
  align-items: baseline;
  gap: 12rpx;
  margin-bottom: 12rpx;
  .down-icon {
    width: 13rpx;
    height: 20rpx;
  }
}

.price-main {
  font-family: Source Han Sans CN;
  font-weight: bold;
  font-size: 36rpx;
  color: #f9432e;
  line-height: 42rpx;
}

.price-unit {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #908d94;
  line-height: 42rpx;
}

.stat-item {
  font-size: 22rpx;
  color: #999;
}

.commission-icon {
  width: 32rpx;
  height: 32rpx;
}

.commission-text {
  font-size: 22rpx;
  color: #ff4d4f;
}

.loading-more,
.no-more {
  text-align: center;
  padding: 32rpx 0;
  font-size: 24rpx;
  color: #999;
}
</style>
