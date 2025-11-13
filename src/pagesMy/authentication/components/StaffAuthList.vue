<script setup lang="ts">
import { ref } from 'vue'

export interface ActionButton {
  label: string
  action: string
}

export interface StaffAuthItem {
  id: string | number
  // 用于按钮判定的关键字段
  status?: number | string // 签约状态（示例：0 待签约）
  put_away?: number | string // 上下架：0 下架，1 上架
  been_put_away?: number | string // 是否曾上架过：1 是
  is_sale?: number | string // 是否已售：1 是
  // 其他
  [key: string]: any
}

const props = defineProps({
  list: {
    type: Array as () => any[],
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  hasMore: {
    type: Boolean,
    default: true,
  },
  refreshing: {
    type: Boolean,
    default: false,
  },
  actions: {
    type: Array as () => ActionButton[],
    default: () => [],
  },
  currentType: {
    type: String,
    default: '',
  },
  heightOffset: {
    type: Number,
    default: 700,
  },
})

const emit = defineEmits<{
  loadMore: []
  itemClick: [item: StaffAuthItem]
  action: [action: string, item: StaffAuthItem]
  refresh: []
}>()

const scrollTop = ref(0)
const isLoadingMore = ref(false)

// 触底加载
const handleScrollToLower = () => {
  if (isLoadingMore.value || !props.hasMore || props.loading) {
    return
  }
  isLoadingMore.value = true
  emit('loadMore')
  setTimeout(() => {
    isLoadingMore.value = false
  }, 500)
}

// 点击列表项
const handleItemClick = (item: StaffAuthItem) => {
  emit('itemClick', item)
}

// 点击操作按钮
const handleAction = (action: string, item: StaffAuthItem, event: Event) => {
  event.stopPropagation()
  console.log('点击操作按钮:', action, item)
  emit('action', action, item)
}

// 待签约按钮组
const PENDING_ACTIONS: ActionButton[] = [
  { label: '跟进记录', action: 'view' },
  { label: '费用', action: 'fee' },
  { label: '签约', action: 'sign' },
  { label: '编辑', action: 'edit' },
]

// 待上架按钮组
const WAITING_ACTIONS: ActionButton[] = [
  { label: '跟进记录', action: 'view' },
  { label: '上架', action: 'online' },
  { label: '装修管理', action: 'decorate' },
  { label: '编辑', action: 'edit' },
  { label: '投资人', action: 'investor' },
  { label: '签约信息', action: 'sign' },
  { label: '费用', action: 'fee' },
]
// 已上架按钮组
const LISTED_ACTIONS: ActionButton[] = [
  { label: '跟进记录', action: 'view' },
  { label: '下架', action: 'offline' },
  { label: '装修管理', action: 'decorate' },
  { label: '编辑', action: 'edit' },
  { label: '投资人', action: 'investor' },
  { label: '签约信息', action: 'sign' },
  { label: '成交信息', action: 'deal' },
  { label: '查看', action: 'detail' },
  { label: '费用', action: 'fee' },
]

// 已售卖按钮组
const SOLD_ACTIONS: ActionButton[] = [
  { label: '跟进记录', action: 'view' },
  { label: '下架', action: 'offline' },
  { label: '装修管理', action: 'decorate' },
  { label: '编辑', action: 'edit' },
  { label: '手续管理', action: 'procedure' },
  { label: '签约信息', action: 'sign' },
  { label: '成交信息', action: 'deal' },
  { label: '查看', action: 'detail' },
  { label: '费用', action: 'fee' },
]

const getItemActions = (item: StaffAuthItem): ActionButton[] => {
  const status = Number((item as any).status)
  const putAway = Number((item as any).put_away)
  // const beenPutAway = Number((item as any).been_put_away)
  const isSale = Number((item as any).is_sale)

  // 优先级：已售完 > 待签约 > 待上架 > 已上架
  // put_away  其实就用他判断就行  等于 0待上架 ，1 已上架
  if (status === 1) return PENDING_ACTIONS //待签约
  if (isSale === 1) return SOLD_ACTIONS //已售卖

  if (putAway === 0) return WAITING_ACTIONS //待上架
  if (putAway === 1) return LISTED_ACTIONS //已上架
  return []
}

// 获取状态颜色
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    1: '#3399FF',
    2: '#00B050',
  }
  return colorMap[status] || '#3399FF'
}

const getStatusText = (status: string) => {
  const colorMap: Record<string, string> = {
    1: '待签约',
    2: '已签约',
  }
  return colorMap[status] || ''
}

// 装修
const getStatusColor1 = (status: string): string => {
  const colorMap: Record<string, string> = {
    0: '',
    1: '#3399FF',
    2: '#863FCEFF',
    3: '#ffa939',
  }
  return colorMap[status] || '#3399FF'
}

const getStatusText1 = (status: string) => {
  const colorMap: Record<string, string> = {
    0: '',
    1: '装修中',
    2: '装修完成',
    3: '装修交付',
  }
  return colorMap[status] || ''
}

// 上架
const getStatusColor2 = (status: string): string => {
  const colorMap: Record<string, string> = {
    0: '#999999FF',
    1: '#00B050FF',
  }
  return colorMap[status] || '#999999FF'
}

const getStatusText2 = (status: string) => {
  const colorMap: Record<string, string> = {
    0: '已下架',
    1: '已上架',
  }
  return colorMap[status] || ''
}

// 售卖
const getStatusColor3 = (status: string): string => {
  const colorMap: Record<string, string> = {
    0: '999999FF',
    1: '#00B050FF',
  }
  return colorMap[status] || '999999FF'
}

const getStatusText3 = (status: string) => {
  const colorMap: Record<string, string> = {
    0: '',
    1: '已售',
  }
  return colorMap[status] || ''
}

// 审核
const getStatusColor4 = (status: string): string => {
  const colorMap: Record<string, string> = {
    0: '#999999FF',
    1: '#3399FFFF',
    2: '#25b967',
    3: '#FF0000FF',
  }
  return colorMap[status] || '#999999FF'
}

const getStatusText4 = (status: string) => {
  const colorMap: Record<string, string> = {
    0: '',
    1: '上架审核',
    2: '审核通过',
    3: '审核驳回',
  }
  return colorMap[status] || ''
}

// 危险
const getStatusColor5 = (status: string): string => {
  const colorMap: Record<string, string> = {
    0: '#999999FF',
    1: '#FB483B;',
  }
  return colorMap[status] || '#999999FF'
}

const getStatusText5 = (status: string) => {
  const colorMap: Record<string, string> = {
    0: '',
    1: '危险池',
  }
  return colorMap[status] || ''
}

// 下拉刷新
const onRefresh = () => {
  emit('refresh')
}

// 刷新恢复
const onRestore = () => {}
</script>

<template>
  <scroll-view
    class="staff-auth-list"
    :style="{ height: `calc(100vh - env(safe-area-inset-bottom) - ${props.heightOffset}rpx)` }"
    scroll-y
    :scroll-top="scrollTop"
    refresher-enabled
    :refresher-triggered="refreshing"
    @refresherrefresh="onRefresh"
    @refresherrestore="onRestore"
    @scrolltolower="handleScrollToLower"
  >
    <view class="list-container">
      <view v-for="item in list" :key="item.id" class="auth-item" @tap="handleItemClick(item)">
        <!-- 顶部时间和状态 -->
        <view class="item-header">
          <text class="item-datetime">{{ item.create_time }}</text>
          <view class="status-badges">
            <!--
             0全部，1待签约，2待上架，3已上架，4已售卖

                签约 ：所有的tab下都显示，不进行校验
                装修：待签约不显示,其余tab下都显示 全部
                上架：已上架，全部(put_away ==1)下都显示
                售卖：已售卖tab 全部下显示
                审核：待上架tab 已售卖下显示 全部
                危险：已上架tab下显示 全部
-->
            <text class="status-text" :style="{ color: getStatusColor(item.status) }">
              {{ getStatusText(item.status) }}
            </text>

            <!-- 装修 返回0不显示，不做判断 -->
            <text class="status-text" :style="{ color: getStatusColor1(item.house_remode) }">
              {{ getStatusText1(item.house_remode) }}
            </text>
            <!-- 上架  status=2显示  status == 1待签约   ==2已签约
             status== 2 {
                put_away == 1 已上架
                put_away ==  已下架
                } -->
            <text
              v-if="item.status == 2"
              class="status-text"
              :style="{ color: getStatusColor2(item.put_away) }"
            >
              {{ getStatusText2(item.put_away) }}
            </text>
            <!-- 售卖 不用处理判断，未售不显示 -->
            <text
              v-if="props.currentType === '4' || props.currentType === '0'"
              class="status-text"
              :style="{ color: getStatusColor3(item.is_sale) }"
            >
              {{ getStatusText3(item.is_sale) }}
            </text>
            <!-- 审核 不用做多余判断 -->
            <text
              v-if="props.currentType === '2' || props.currentType === '4'"
              class="status-text"
              :style="{ color: getStatusColor4(item.examine_status) }"
            >
              {{ getStatusText4(item.examine_status) }}
            </text>
            <!-- 危险 -->
            <text
              v-if="props.currentType === '3' || props.currentType === '0'"
              class="status-text"
              :style="{ color: getStatusColor5(item.is_danger) }"
            >
              {{ getStatusText5(item.is_danger) }}
            </text>
          </view>
        </view>

        <!-- 主体内容 -->
        <view class="item-main">
          <!-- 左侧图片 -->
          <image class="item-image" :src="item.pic" mode="aspectFill"></image>

          <!-- 右侧信息 -->
          <view class="item-info">
            <!-- 标题 -->
            <text class="item-title">{{ item.house_title || item.house_list_title }}</text>

            <!-- 编号 -->
            <view class="item-detail">
              <item class="left">
                <text class="detail-label">编号：</text>
                <text class="detail-value">{{ item.house_code }}</text>
              </item>

              <item class="right">
                <text class="detail-label">投资人：</text>
                <text class="detail-value">{{ item.investor_name }}</text>
              </item>
            </view>

            <!-- 小区 -->
            <view class="item-detail">
              <item class="left">
                <text class="detail-label">小区：</text>
                <text class="detail-value">{{ item.pharmacist_name }}</text>
              </item>

              <item class="right">
                <text class="detail-label">到期日：</text>
                <text class="detail-value">{{ item.sign_end_time }}</text>
              </item>
            </view>
          </view>
        </view>

        <!-- 底部操作按钮 -->
        <view v-if="getItemActions(item).length > 0" class="item-actions">
          <view
            v-for="(btn, btnIndex) in getItemActions(item)"
            :key="btnIndex"
            class="action-button"
            @tap="handleAction(btn.action, item, $event)"
          >
            <text class="action-text">{{ btn.label }}</text>
          </view>
        </view>
      </view>
      <!-- 加载状态 -->
      <view v-if="loading || isLoadingMore" class="loading-wrapper">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据 -->
      <view v-else-if="!hasMore && list.length > 0" class="no-more">
        <text class="no-more-text">没有更多了</text>
      </view>

      <!-- 空状态 -->
      <view v-if="!loading && list.length === 0" class="empty-state">
        <text class="empty-text">暂无数据</text>
      </view>
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.staff-auth-list {
  width: 100%;
  background: #f5f5f5;
}

.list-container {
  padding: 0rpx 32rpx 20rpx 32rpx;
}

.auth-item {
  margin-bottom: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  padding: 24rpx;

  &:active {
    opacity: 0.95;
  }
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.item-datetime {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  color: #7b678f;
  line-height: 42rpx;
}

.status-badges {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.status-badge {
  display: inline-flex;
}

.status-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 24rpx;
  line-height: 42rpx;
}

.item-main {
  display: flex;
  gap: 22rpx;
  margin-bottom: 24rpx;
}

.item-image {
  width: 166rpx;
  height: 167rpx;
  border-radius: 10rpx;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16rpx;
  min-width: 0;
}

.item-title {
  font-family: Source Han Sans CN;
  font-weight: 500;
  font-size: 28rpx;
  color: #030509;
  line-height: 36rpx;
}

.item-detail {
  display: flex;
  align-items: center;
  gap: 8rpx;
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
  }
}

.detail-label {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #6a6a6a;
  line-height: 40rpx;
}

.detail-value {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 22rpx;
  color: #6a6a6a;
  line-height: 40rpx;
}

.item-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  gap: 16rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64rpx;
  background: #ffffff;
  border-radius: 30rpx;
  border: 2px solid #863fce;

  &:active {
    opacity: 0.8;
  }
}

.action-text {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  line-height: 36rpx;
  color: #863fce;
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

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #bfbfbf;
}
</style>
