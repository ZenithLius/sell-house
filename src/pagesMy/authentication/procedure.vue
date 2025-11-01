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
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMore"
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

const currentRole = uni.getStorageSync('currentOtherManageType')

interface ProcedureItem {
  id: string | number
  status: string
  time: string
  remark: string
}

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
      url: '/pagesMy/authentication/addProcedure',
    })
  }
}

const { safeAreaInsets } = uni.getSystemInfoSync()

const procedureList = ref<ProcedureItem[]>([
  {
    id: 1,
    status: '完结',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
  {
    id: 2,
    status: '放款',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
  {
    id: 3,
    status: '过户',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
  {
    id: 3,
    status: '过户',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
  {
    id: 3,
    status: '过户',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
  {
    id: 3,
    status: '过户',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
  {
    id: 3,
    status: '过户',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
  {
    id: 3,
    status: '过户',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },

  {
    id: 3,
    status: '过户',
    time: '2025.09.01 10:00:00',
    remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
  },
])

const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)

const handleBack = () => {
  uni.navigateBack()
}

// 加载更多
const loadMore = () => {
  if (loading.value || !hasMore.value) {
    return
  }

  loading.value = true

  // 模拟API请求
  setTimeout(() => {
    const newData: ProcedureItem[] = [
      {
        id: procedureList.value.length + 1,
        status: '审核中',
        time: '2025.09.02 14:20:00',
        remark: '备注文字介绍备注文字介绍备注文字介绍备注文字介绍',
      },
    ]

    procedureList.value.push(...newData)
    currentPage.value++

    // 模拟没有更多数据
    if (currentPage.value >= 4) {
      hasMore.value = false
    }

    loading.value = false
  }, 1000)
}

// 点击记录项
const handleItemClick = (item: ProcedureItem) => {
  console.log('点击了手续项:', item)
  // TODO: 可以在这里跳转到详情页等
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
