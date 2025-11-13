<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'费用列表'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <!-- list -->
      <FeeList
        :list="feeList"
        :loading="loading"
        :hasMore="hasMore"
        @loadMore="loadMore"
        @refresh="onRefresh"
      />
    </view>
    <ShBottomBtns
      v-if="currentRole !== 'manager'"
      :buttons="bottomButtons"
      :paddingBottom="20"
      @click="handleButtonClick"
    />
    <!-- <BottomTabbar /> -->
    <view class="pop" :style="{ paddingTop: safeAreaInsets!.top + 40 + 'px' }">
      <ShPopup
        ref="addFeePopup"
        title="添加费用"
        @cancel="handlePopupCancel"
        @confirm="handlePopupConfirm"
      >
        <ShCustomForm v-model="formData" :fields="fields" />
      </ShPopup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import FeeList from './components/FeeList.vue'
import BottomTabbar from './components/BottomTabbar.vue'
import ShPopup from '@/components/ShPopup.vue'

const { safeAreaInsets } = uni.getSystemInfoSync()
const currentRole = uni.getStorageSync('currentOtherManageType')
import type { CustomFormField } from '@/types/customFormField'
import { addFeeAPI, feeListAPI, feeTypeListAPI, feeListManagerAPI } from '../services/staff'
import { onLoad } from '@dcloudio/uni-app'

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */
const houseListId = ref('')

onLoad(async (options) => {
  houseListId.value = options?.house_list_id
  await Promise.all([getFeeTypeListReq(), getFeeListReq()])
})

// 获取费用类型
const getFeeTypeListReq = async () => {
  const res = await feeTypeListAPI({})
  const target = fields.value.find((f) => f.key === 'expense_type_id')
  if (target) {
    target.options = res.data
  }
}

/**
 * ==================================费用列表========================================
 */

const getFeeListReq = async (isRefresh = false) => {
  if (loading.value) return

  loading.value = true
  try {
    if (isRefresh) {
      currentPage.value = 1
    }

    const params = {
      house_list_id: houseListId.value,
      page: currentPage.value,
      per_page: pageSize,
    }
    const res =
      currentRole === 'manager' ? await feeListManagerAPI(params) : await feeListAPI(params)

    if (currentPage.value === 1 || isRefresh) {
      feeList.value = res.data.list || []
    } else {
      feeList.value = [...feeList.value, ...(res.data.list || [])]
    }

    hasMore.value = res.data.list && res.data.list.length >= pageSize
  } catch (error) {
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    loading.value = false
  }
}

interface FeeItem {
  created_at: string
  created_time: string
  expense_type_id: number
  expense_type_title: string
  price: string
  remark: string
  title: null
}

const formData = ref({
  expense_type_id: '',
  title: '',
  price: '',
  remark: '',
})

/**
 * ==========================================================================
 *                                 @新增费用
 * ==========================================================================
 */

const addFeeReq = async () => {
  if (!formData.value.expense_type_id) {
    uni.showToast({
      title: '请选择费用类型',
      icon: 'none',
    })
    return
  }
  if (Number(formData.value.expense_type_id) === 1 && !formData.value.title) {
    uni.showToast({
      title: '请输入费用名称',
      icon: 'none',
    })
    return
  }
  if (!formData.value.price) {
    uni.showToast({
      title: '请输入费用金额',
      icon: 'none',
    })
    return
  }

  uni.showLoading({
    title: '保存中',
  })
  const params = {
    house_list_id: houseListId.value,
    ...formData.value,
  }
  const res = await addFeeAPI(params)
  uni.hideLoading()
  if (res.code === 200) {
    uni.showToast({
      title: '保存成功',
      icon: 'none',
    })
    addFeePopup.value?.close()
    formData.value = {
      expense_type_id: '',
      title: '',
      price: '',
      remark: '',
    }
    await getFeeListReq(true) // 刷新列表
  } else {
    uni.showToast({
      title: res.msg || '保存失败',
      icon: 'none',
    })
  }
}

// 弹窗取消
const handlePopupCancel = () => {
  console.log('取消添加费用')
}

// 弹窗确认
const handlePopupConfirm = () => {
  addFeeReq()
}

const fields = ref<CustomFormField[]>([
  {
    key: 'expense_type_id',
    label: '费用类型',
    type: 'select',
    placeholder: '请选择',
    options: [],
  },
  {
    key: 'title',
    label: '费用名称',
    placeholder: '请输入',
    type: 'input',
    visible: (form) => form.expense_type_id === 1,
  },
  {
    key: 'price',
    label: '费用金额',
    inputType: 'digit',
    placeholder: '请输入',
    type: 'input',
  },
  { key: 'remark', label: '备注', placeholder: '请输入', type: 'textarea' },
])

watch(
  () => formData.value.expense_type_id,
  (newVal) => {
    if (newVal !== '4') {
      formData.value.title = ''
    }
  },
)

const bottomButtons = [
  {
    text: '新增费用',
    background: '#863fce',
    color: '#ffffff',
  },
]

// 弹窗引用
const addFeePopup = ref<InstanceType<typeof ShPopup> | null>(null)

const handleButtonClick = (index: number) => {
  if (index === 0) {
    addFeePopup.value?.open()
  }
}

// 数据状态
const feeList = ref<FeeItem[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = 10

// 触底加载更多
const loadMore = async () => {
  if (!hasMore.value || loading.value) {
    return
  }
  currentPage.value++
  await getFeeListReq()
}

// 下拉刷新
const onRefresh = async () => {
  await getFeeListReq(true)
}

const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #f7f8fc;
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
}
</style>
