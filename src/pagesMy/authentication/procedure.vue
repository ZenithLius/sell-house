<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'手续管理'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <ProcedureList
        :list="procedureList"
        :loading="isLoading"
        :hasMore="hasMore"
        :isTriggered="isTriggered"
        @refresh="onRefresherrefresh"
        @loadMore="handleScrollToLower"
        @itemClick="handleItemClick"
      />
    </view>

    <BottomTabbar />
    <ShBottomBtns
      v-if="currentRole !== 'manager'"
      :buttons="bottomButtons"
      @click="handleButtonClick"
      :backgroundColor="'#ffffff'"
    />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProcedureList from './components/ProcedureList.vue'
import BottomTabbar from './components/BottomTabbar.vue'
import { procedureListAPI, type ProcedureItem } from '../services/staff'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useScrollRefresh } from '@/composables/testUseScroller'
const { safeAreaInsets } = uni.getSystemInfoSync()

const currentRole = uni.getStorageSync('currentOtherManageType')

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

const houseListId = ref<string | number>('')

onLoad((options) => {
  houseListId.value = options?.house_list_id || ''
})

const fetchData = async (page: number) => {
  uni.showLoading({
    title: '加载中',
  })
  const res = await procedureListAPI(houseListId.value, page, 10)
  uni.hideLoading()
  if (res.code !== 200) {
    uni.showToast({
      title: res.msg,
      icon: 'none',
    })
    return []
  }
  return res.data.list
}
/**
 * ==========================================================================
 */

const {
  list: procedureList,
  isLoading,
  hasMore,
  isTriggered,
  onRefresherrefresh,
  handleScrollToLower,
  refresh,
} = useScrollRefresh<ProcedureItem>({
  fetchData,
  pageSize: 10,
  immediate: false,
})

onShow(() => {
  refresh()
})

const bottomButtons = [
  {
    text: '新增手续',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    uni.navigateTo({
      url: `/pagesMy/authentication/addProcedure?house_list_id=${houseListId.value}`,
    })
  }
}

const handleBack = () => {
  uni.navigateBack()
}

const handleItemClick = (item: any) => {
  console.log('点击了手续项=======', item)
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  height: 100vh;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
