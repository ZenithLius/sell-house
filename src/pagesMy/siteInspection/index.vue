<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'实勘房源'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <view class="form-one">
        <ShCustomForm v-model="formData" :fields="fields" />
      </view>

      <view class="btn" @tap="handleSubmit"> 提交房源 </view>
    </view>

    <!-- <ShBottomTabbar /> -->
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import type { CustomFormField } from '@/types/customFormField'
import { getCommunityListAPI } from '@/pagesMy/services/agent'
import { useUserStore } from '@/stores'
import { ref, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import {
  getBuildingStructureListAPI,
  getDecorationListAPI,
  getElevatorListAPI,
  getFeatureListAPI,
  getHouseOrientationListAPI,
  getHousePurposeListAPI,
  getHouseTypeListAPI,
  getNumListAPI,
  getOwnershipListAPI,
  getPlaceHouselistAPI,
  publishHouseAPI,
} from '@/pagesMy/services/staff'

import { getHouseDetailAPI, type HouseListParams } from '@/services/index/page'
const houseListId = ref('')
const userStore = useUserStore()
onLoad(async (options) => {
  uni.showLoading({
    title: '加载中...',
    mask: true,
  })

  try {
    houseListId.value = options?.house_list_id
    await Promise.all([
      getCurrentUserInfo(),
      getCommunityListReq(),
      getNumListReq(),
      getHouseTypeListReq(),
      getHouseOrientationListReq(),
      getBuildingStructureListReq(),
      getDecorationListReq(),
      getElevatorListReq(),
      getHousePurposeListReq(),
      getPlaceHouselistReq(),
      getOwnershipListReq(),
      getFeatureListReq(),
    ])

    if (houseListId.value) {
      await getHouseDetailAPIReq()
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none',
    })
  } finally {
    uni.hideLoading()
  }
})

const getHouseDetailAPIReq = async () => {
  const params: any = {
    id: houseListId.value,
    share_user_id: '',
  }
  const res = await getHouseDetailAPI(params)
  formData.value = res.data
  formData.value.feature_house_ids = res.data.feature_house_ids?.split(',').map(Number)
  formData.value.floor_img = res.data.floor_img?.split(',')
  formData.value.mul_img = res.data.mul_img?.split(',')
  formData.value.room_img = res.data.room_img?.split(',')
  formData.value.video_url = res.data.video_url?.split(',')

  console.log('房源详情===================:', formData.value)
}

const getCurrentUserInfo = async () => {
  formData.value.username = userStore.userInfo?.nickname
  formData.value.user_mobile = userStore.userInfo?.mobile
}

/**
 * ==========================================================================
 *                                 @表单提交
 * ==========================================================================
 */

const handleSubmit = async () => {
  const params = formData.value
  params.video_url = Array.isArray(params.video_url) ? params.video_url.join(',') : ''
  params.feature_house_ids = Array.isArray(params.feature_house_ids)
    ? params.feature_house_ids.join(',')
    : ''
  params.floor_img = Array.isArray(params.floor_img) ? params.floor_img.join(',') : ''
  params.mul_img = Array.isArray(params.mul_img) ? params.mul_img.join(',') : ''
  params.room_img = Array.isArray(params.room_img) ? params.room_img.join(',') : ''
  params.status = 1
  params.put_away = 0
  uni.showLoading({
    title: '提交中...',
  })
  const res = await publishHouseAPI(formData.value)
  uni.hideLoading()
  if (res.code === 200) {
    uni.showToast({
      title: '提交成功',
      icon: 'none',
    })
  } else {
    uni.showToast({
      title: '提交失败',
      icon: 'none',
    })
  }
  const { username, user_mobile } = formData.value
  formData.value = {
    commission: '',
    decoration_house_id: '',
    delivery_date: '',
    detail_building: '',
    detail_room: '',
    detail_unit: '',
    exposure_house_id: '',
    feature_house_ids: '',
    floor_img: [],
    home_num: '',
    house_area: '',
    lift_house_id: '',
    lift_num: '',
    lock_code: '',
    lock_mac: '',
    mul_img: [],
    now_floor: '',
    per_price: '',
    pharmacist_id: '',
    place_house_id: '',
    property_house_id: '',
    put_away: '',
    room_img: [],
    status: '',
    structure_house_id: '',
    style_balcony: '',
    style_bathroom: '',
    style_bedroom: '',
    style_house_id: '',
    style_kitchen: '',
    style_livingroom: '',
    title: '',
    total_floor: '',
    total_price: '',
    use_house_id: '',
    user_mobile,
    username,
    video_url: '',
    vr_url: '',
  }
}

/**
 * ==========================================================================
 *                                 @表单异步数据获取
 * ==========================================================================
 */

/**
 * ==================================小区数据获取========================================
 */

const getCommunityListReq = async () => {
  const res = await getCommunityListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'pharmacist_id')
  if (target) {
    target.options = list
  }
}
/**
 * ==================================房型数据获取========================================
 */

const transformRoomData = (data: Array<{ id: number }>, type: string) => {
  return data.map((item) => ({
    title: `${item.id}${type}`,
    id: item.id,
  }))
}

const getNumListReq = async () => {
  const res = await getNumListAPI()
  const list = (res as any)?.data || []

  const optionMap: Array<{ key: string; src: string }> = [
    { key: 'style_bedroom', src: 'bedroom' },
    { key: 'style_livingroom', src: 'livingroom' },
    { key: 'style_bathroom', src: 'bathroom' },
    { key: 'style_kitchen', src: 'kitchen' },
    { key: 'style_balcony', src: 'terrace' },
  ]

  optionMap.forEach(({ key, src }) => {
    const target = fields.value.find((f) => f.key === key)
    if (target) {
      target.options = transformRoomData(((list as any)[src] || []) as Array<{ id: number }>, '')
    }
  })
  console.log('房型数据===================:', fields.value)
}

/**
 * ==================================户型结构========================================
 */

const transformHouseTypeData = (data: Array<{ order_id: number }>, type: string) => {
  return data.map((item, index) => ({
    title: `${item.order_id}${type}${index === data.length - 1 ? '以上' : ''}`,
    id: item.order_id,
  }))
}

const getHouseTypeListReq = async () => {
  const res = await getHouseTypeListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'style_house_id')
  if (target) {
    target.options = transformHouseTypeData(list, '室')
  }
  console.log('户型结构===================:', target)
}

/**
 * ==================================房屋朝向========================================
 */

const getHouseOrientationListReq = async () => {
  const res = await getHouseOrientationListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'exposure_house_id')
  if (target) {
    target.options = list
  }
}

/**
 * ==================================建筑结构管理========================================
 */

const getBuildingStructureListReq = async () => {
  const res = await getBuildingStructureListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'structure_house_id')
  if (target) {
    target.options = list
  }
}

/**
 * ==================================装修情况========================================
 */

const getDecorationListReq = async () => {
  const res = await getDecorationListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'decoration_house_id')
  if (target) {
    target.options = list
  }
}
/**
 * ==================================配备电梯========================================
 */

const getElevatorListReq = async () => {
  const res = await getElevatorListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'lift_house_id')
  if (target) {
    target.options = list
  }
}
/**
 * ==================================房屋用途========================================
 */

const getHousePurposeListReq = async () => {
  const res = await getHousePurposeListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'use_house_id')
  if (target) {
    target.options = list
  }
}

/**
 * ==================================户口数据========================================
 */

const getPlaceHouselistReq = async () => {
  const res = await getPlaceHouselistAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'place_house_id')
  if (target) {
    target.options = list
  }
}

/**
 * ==================================产权情况========================================
 */

const getOwnershipListReq = async () => {
  const res = await getOwnershipListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'property_house_id')
  if (target) {
    target.options = list
  }
}

/**
 * ==================================特色标签========================================
 */

const getFeatureListReq = async () => {
  const res = await getFeatureListAPI()
  const list = (res as any)?.data || []
  const target = fields.value.find((f) => f.key === 'feature_house_ids')
  if (target) {
    target.options = list
  }
}

/**
 * ==========================================================================
 *                                 @表单相关数据处理
 * ==========================================================================
 */
const formData = ref<any>({
  commission: '',
  decoration_house_id: '',
  delivery_date: '',
  detail_building: '',
  detail_room: '',
  detail_unit: '',
  exposure_house_id: '',
  feature_house_ids: '',
  floor_img: [],
  home_num: '',
  house_area: '',
  lift_house_id: '',
  lift_num: '',
  lock_code: '',
  lock_mac: '',
  mul_img: [],
  now_floor: '',
  per_price: '',
  pharmacist_id: '',
  place_house_id: '',
  property_house_id: '',
  put_away: '',
  room_img: [],
  status: '',
  structure_house_id: '',
  style_balcony: '',
  style_bathroom: '',
  style_bedroom: '',
  style_house_id: '',
  style_kitchen: '',
  style_livingroom: '',
  title: '',
  total_floor: '',
  total_price: '',
  use_house_id: '',
  user_mobile: '',
  username: '',
  video_url: '',
  vr_url: '',
})
watch(formData, (newVal) => {
  if (newVal.house_area && newVal.total_price) {
    newVal.per_price = (newVal.total_price / newVal.house_area) * 10000
  } else {
    newVal.per_price = ''
  }

  if (newVal.priceStatus1) {
    newVal.total_price = ''
  }
  if (newVal.priceStatus2) {
    newVal.per_price = ''
  }
})

const handleBack = () => {
  uni.navigateBack()
}
// pharmacist_id
const fields = ref<CustomFormField[]>([
  {
    key: 'title',
    label: '标题',
    type: 'input',
    placeholder: '请输入房源标题',
  },
  {
    key: 'pharmacist_id',
    label: '所在小区',
    type: 'select',
    placeholder: '请选择',
    options: [],
  },
  {
    key: 'area',
    label: '详细地址',
    unit: '栋',
    type: 'none',
    placeholder: '',
  },
  {
    key: 'detail_building',
    label: 'none',
    unit: '栋',
    type: 'input',
    placeholder: '输入',
    col: 8,
  },
  {
    key: 'detail_unit',
    label: 'none',
    unit: '单元',
    type: 'input',
    placeholder: '输入',
    col: 8,
  },
  {
    key: 'detail_room',
    label: 'none',
    unit: '室',
    type: 'input',
    placeholder: '输入',
    col: 8,
  },
  {
    key: 'house_area',
    label: '建筑面积',
    type: 'input',
    unit: '㎡',
    inputType: 'digit',
    placeholder: '请输入',
  },
  {
    key: 'area',
    label: '房型',
    unit: '栋',
    type: 'none',
    placeholder: '',
  },
  {
    key: 'style_bedroom',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '室',
    options: [],
    col: 8,
  },
  {
    key: 'style_livingroom',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '厅',
    options: [],
    col: 8,
  },
  {
    key: 'style_bathroom',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '卫',
    options: [],
    col: 8,
  },
  {
    key: 'style_kitchen',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '厨',
    options: [],
    col: 8,
  },
  {
    key: 'style_balcony',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '阳台',
    options: [],
    col: 8,
  },
  {
    key: 'communityName',
    label: 'none',
    type: 'none',
    placeholder: '选择',
    col: 8,
  },
  {
    key: 'totalPrice',
    label: '总价',
    type: 'none',
    placeholder: '请输入',
    unit: '万元',
    col: 16,
  },
  {
    key: 'total_price',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '万元',
    col: 16,
  },
  {
    key: 'loading1',
    label: 'none',
    type: 'radio',
    placeholder: '',
    col: 8,
    radioLabel: '待定',
    radioKey: 'priceStatus1',
  },
  {
    key: '是个标题',
    label: '单价',
    type: 'none',
    placeholder: '',
    unit: '万元',
    col: 16,
  },
  {
    key: 'per_price',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '元/m²',
    col: 16,
  },
  {
    key: 'loading2',
    label: 'none',
    type: 'radio',
    placeholder: '',
    col: 8,
    radioLabel: '待定',
    radioKey: 'priceStatus2',
  },
  {
    key: 'style_house_id',
    label: '户型结构',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },
  {
    key: 'exposure_house_id',
    label: '房屋朝向',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },
  {
    key: 'structure_house_id',
    label: '建筑结构',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },
  {
    key: 'decoration_house_id',
    label: '装修情况',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },
  {
    key: 'area',
    label: '楼户比例',
    unit: '栋',
    type: 'none',
    placeholder: '',
  },
  {
    key: 'lift_num',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '梯',
    col: 12,
  },
  {
    key: 'home_num',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '户',
    col: 12,
  },
  {
    key: 'lift_house_id',
    label: '配备电梯',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },

  {
    key: 'area',
    label: '所在楼层',
    unit: '栋',
    type: 'none',
    placeholder: '',
  },
  {
    key: 'total_floor',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '共',
    col: 12,
  },
  {
    key: 'now_floor',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '层',
    col: 12,
  },

  {
    key: 'delivery_date',
    label: '交房时间',
    type: 'date',
    placeholder: '请输入',
    col: 24,
  },

  {
    key: 'use_house_id',
    label: '房屋用途',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },

  {
    key: 'place_house_id',
    label: '户口',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },

  {
    key: 'property_house_id',
    label: '产权情况',
    type: 'select',
    placeholder: '请选择',
    options: [],
    col: 24,
  },

  {
    key: 'feature_house_ids',
    label: '特色标签（多选，最多六个）',
    type: 'select-multiple',
    placeholder: '请选择',
    options: [],
    maxCount: 6,
    col: 24,
  },

  {
    key: 'communityName',
    label: 'none',
    type: 'line',
    placeholder: '',
    col: 24,
  },

  {
    key: 'floor_img',
    label: '实勘图',
    type: 'upload',
    maxCount: 6,
    col: 24,
    weight: 'bold',
    desc: '第一张图作为封面，可多图上传，最多6张 /n 建议尺寸750*750像素，最大3M',
  },

  {
    key: 'communityName',
    label: 'none',
    type: 'line',
    placeholder: '',
    col: 24,
  },

  {
    key: 'mul_img',
    label: '房源轮播图',
    type: 'upload',
    maxCount: 6,
    col: 24,
    weight: 'bold',
    desc: '第一张图作为封面，可多图上传，最多6张 /n 建议尺寸750*750像素，最大3M',
  },

  {
    key: 'room_img',
    label: '户型图',
    type: 'upload',
    maxCount: 6,
    col: 24,
    weight: 'bold',
    desc: '可多图上传，最多6张 /n 建议尺寸750*750像素，最大3M',
  },
  {
    key: 'video_url',
    label: '视频',
    type: 'upload-video',
    maxCount: 6,
    col: 24,
    weight: 'bold',
    desc: '可上传两分以内的视频',
  },
  {
    key: 'vr_url',
    label: 'VR地址',
    type: 'input',
    col: 24,
    weight: 'bold',
    placeholder: '请输入',
  },
  {
    key: '',
    label: '智能锁配置',
    type: 'none',
    col: 24,
    weight: 'bold',
  },
  {
    key: 'lock_mac',
    label: '门锁MAC',
    type: 'input',
    col: 24,
    placeholder: '请输入',
  },
  {
    key: 'lock_code',
    label: '门锁管理员编码',
    type: 'input',
    col: 24,
    placeholder: '请输入',
  },

  {
    key: '标题',
    label: '项目联系人',
    type: 'none',
    col: 24,
    weight: 'bold',
  },
  {
    key: 'username',
    label: '姓名',
    type: 'input',
    col: 24,
    placeholder: '请输入',
  },
  {
    key: 'user_mobile',
    label: '电话',
    type: 'input',
    inputType: 'number',
    col: 24,
    placeholder: '请输入',
  },
  {
    key: 'commission',
    label: '佣金',
    type: 'input',
    inputType: 'digit',
    col: 24,
    weight: 'bold',
    placeholder: '请输入',
  },
])
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .content {
    padding-bottom: calc(env(safe-area-inset-bottom) + 50rpx);
  }
  .navbar-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    animation: slideDown 0.3s ease-out;
  }
  .line {
    height: 10rpx;
    background: #f7f8fc;
  }
  .btn {
    width: 532rpx;
    height: 80rpx;
    background: #863fce;
    border-radius: 20rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 35rpx;
    margin: 0 auto;
  }
}
</style>
