<script setup lang="ts">
import { ref, computed } from 'vue'
import type { HomeItem } from '@/types/home'

interface Props {
  //暂时控制，浏览数据，佣金。房价上涨等
  showStats?: boolean
  // 房源列表数据
  homeList?: HomeItem[]
  // 控制是否显示阴影 UI设计不一致 0.0
  showShadow?: boolean
  // 是否显示统计信息
  showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStats: true,
  homeList: () => [],
  showShadow: false,
  showCount: false,
})

// 加载状态
const loading = ref(false)
const finished = ref(false)

// 格式化房源布局（室厅）
const formatLayout = (item: HomeItem) => {
  console.log('格式化房源布局（室厅）=====', item)
  if (item.style_bedroom && item.style_livingroom) {
    return `${item.style_bedroom}室${item.style_livingroom}厅`
  }
  return ''
}

// 格式化楼层信息
const formatFloor = (item: HomeItem) => {
  console.log('格式化楼层信息=====', item)
  if (item.now_floor && item.total_floor) {
    return `${item.now_floor}/${item.total_floor}层`
  }
  return ''
}

// 构建基础信息列表
const buildBasicList = (item: HomeItem) => {
  const list: string[] = []
  const layout = formatLayout(item)
  if (layout) list.push(layout)
  if (item.house_area) list.push(`${item.house_area}m²`)
  const floor = formatFloor(item)
  if (floor) list.push(floor)
  if (item.pharmacist_title) list.push(item.pharmacist_title)
  if (item.style_house_title) list.push(item.style_house_title)
  if (item.pharmacist_name) list.push(item.pharmacist_name)
  return list
}

// 判断价格是上涨还是下降
const isPriceDown = (item: HomeItem) => {
  if (item.old_total_price && item.total_price) {
    return parseFloat(item.total_price) < parseFloat(item.old_total_price)
  }
  return false
}

// 定义事件
const emit = defineEmits<{
  cardClick: [item: HomeItem]
}>()

// 点击房源卡片
const handleCardClick = (item: HomeItem) => {
  emit('cardClick', item)
}
</script>

<template>
  <view class="home-list">
    <view
      v-for="item in props.homeList"
      :key="item.id"
      class="home-card"
      :class="{ 'has-shadow': props.showShadow }"
      @tap="handleCardClick(item)"
    >
      <view class="top">
        <!-- 房源图片 -->
        <image class="home-image" :src="item.pic_img" mode="aspectFill"></image>
        <!-- 房源信息 -->
        <view class="home-info">
          <!-- 标题 -->
          <text class="home-title">{{ item.title || item.house_list_title }}</text>

          <!-- 基本信息  此处后台返回到字段不一致，需要不断添加别名 -->
          <view class="home-basic" v-for="(basic, b) in [buildBasicList(item)]" :key="b">
            <block v-for="(text, i) in basic" :key="i">
              <text class="basic-item">{{ text }}</text>
              <view class="divider" v-if="i < basic.length - 1"></view>
            </block>
          </view>

          <!-- 标签 -->
          <view
            class="home-tags"
            v-if="item.feature_house_title && item.feature_house_title.length > 0"
          >
            <text v-for="(tag, index) in item.feature_house_title" :key="index" class="tag-item">
              {{ tag }}
            </text>
          </view>

          <!-- 价格 -->
          <view class="home-price">
            <text class="price-main" v-if="item.total_price">{{ item.total_price }}万</text>
            <image
              v-if="props.showStats && isPriceDown(item)"
              class="down-icon"
              src="/static/index/downGreen.png"
              mode="aspectFit"
            ></image>
            <image
              v-if="props.showStats && !isPriceDown(item) && item.old_total_price"
              class="down-icon up-icon"
              src="/static/index/upRed.png"
              mode="aspectFit"
            ></image>
            <text class="price-unit" v-if="item.per_price">{{ item.per_price }}元/m²</text>
          </view>
        </view>
      </view>
      <view class="bottom">
        <!-- 统计信息 -->
        <view class="home-stats" v-if="showCount">
          <text class="stat-item">浏览 {{ item.view_count || 0 }}次</text>
          <text class="stat-item">关注 {{ item.follow_count || 0 }}人</text>
          <text class="stat-item">咨询 {{ item.contact_count || 0 }}次</text>
          <text class="stat-item">带看 {{ item.look_count || 0 }}次</text>
        </view>

        <!-- 中介费 -->
        <view
          class="home-commission"
          v-if="
            props.showStats &&
            (item.is_commission === 1 || item.is_show_commission === 1) &&
            item.commission
          "
        >
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
@import '@/uni.scss';

.home-list {
  padding: 25rpx 30rpx;
  background-color: white;
}

.home-card {
  display: flex;
  flex-direction: column;
  border-radius: 16rpx;
  // padding: 10rpx;
  // margin-bottom: 24rpx;

  &.has-shadow {
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
  }

  .top {
    display: flex;
    min-height: 240rpx;
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
  gap: 12rpx;
}

.home-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 30rpx;
  color: #030509;
  line-height: 38rpx;
  text-overflow: ellipsis;
}

.home-basic {
  display: flex;
  align-items: center;
  gap: 16rpx;
  // margin-bottom: 12rpx;
}

.basic-item {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #030509;
  line-height: 42rpx;
}

.divider {
  width: 2rpx;
  height: 16rpx;
  background: #d7dadc;
}

.home-tags {
  display: flex;
  align-items: center;
  gap: 12rpx;
  // margin-bottom: 12rpx;
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
  margin-bottom: 20rpx;
  .down-icon {
    width: 13rpx;
    height: 20rpx;
  }
  .up-icon {
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
