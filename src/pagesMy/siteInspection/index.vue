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

      <view class="btn"> 提交房源 </view>
    </view>

    <ShBottomTabbar />
  </view>
</template>

<script setup lang="ts">
const { safeAreaInsets } = uni.getSystemInfoSync()
import type { CustomFormField } from '@/types/customFormField'
import { ref } from 'vue'

const handleBack = () => {
  uni.navigateBack()
}

const formData = ref({
  communityName: '',
  area: '',
  videourl: '',
})

const fields: CustomFormField[] = [
  {
    key: 'title',
    label: '标题',
    type: 'input',
    placeholder: '请输入房源标题',
  },
  {
    key: 'communityName',
    label: '所在小区',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '小区1', value: '小区1' },
      { label: '小区2', value: '小区2' },
      { label: '小区3', value: '小区3' },
    ],
  },
  {
    key: 'area',
    label: '详细地址',
    unit: '栋',
    type: 'none',
    placeholder: '',
  },
  {
    key: 'area',
    label: 'none',
    unit: '栋',
    type: 'input',
    placeholder: '输入',
    col: 8,
  },
  {
    key: 'area',
    label: 'none',
    unit: '单元',
    type: 'input',
    placeholder: '输入',
    col: 8,
  },
  {
    key: 'area',
    label: 'none',
    unit: '室',
    type: 'input',
    placeholder: '输入',
    col: 8,
  },
  {
    key: 'title',
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
    key: 'communityName',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '市',
    options: [
      { label: '小区1', value: '小区1' },
      { label: '小区2', value: '小区2' },
      { label: '小区3', value: '小区3' },
    ],
    col: 8,
  },
  {
    key: 'communityName',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '厅',
    options: [
      { label: '小区1', value: '小区1' },
      { label: '小区2', value: '小区2' },
      { label: '小区3', value: '小区3' },
    ],
    col: 8,
  },
  {
    key: 'communityName',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '卫',
    options: [
      { label: '小区1', value: '小区1' },
      { label: '小区2', value: '小区2' },
      { label: '小区3', value: '小区3' },
    ],
    col: 8,
  },
  {
    key: 'communityName',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '厨',
    options: [
      { label: '小区1', value: '小区1' },
      { label: '小区2', value: '小区2' },
      { label: '小区3', value: '小区3' },
    ],
    col: 8,
  },
  {
    key: 'communityName',
    label: 'none',
    type: 'select',
    placeholder: '选择',
    unit: '阳台',
    options: [
      { label: '小区1', value: '小区1' },
      { label: '小区2', value: '小区2' },
      { label: '小区3', value: '小区3' },
    ],
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
    key: 'totalPrice',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '万元',
    col: 16,
  },
  {
    key: 'priceStatus',
    label: 'none',
    type: 'radio',
    placeholder: '',
    col: 8,
    radioLabel: '待定',
    radioKey: 'priceStatus',
  },
  {
    key: 'totalPrice',
    label: '单价',
    type: 'none',
    placeholder: '',
    unit: '万元',
    col: 16,
  },
  {
    key: 'totalPrice',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '元/m²',
    col: 16,
  },
  {
    key: 'priceStatus',
    label: 'none',
    type: 'radio',
    placeholder: '',
    col: 8,
    radioLabel: '待定',
    radioKey: 'priceStatus',
  },
  {
    key: 'communityName',
    label: '户型结构',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
    col: 24,
  },
  {
    key: 'communityName',
    label: '房屋朝向',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
    col: 24,
  },
  {
    key: 'communityName',
    label: '建筑结构',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
    col: 24,
  },
  {
    key: 'communityName',
    label: '装修情况',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
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
    key: 'totalPrice',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '栋',
    col: 12,
  },
  {
    key: 'totalPrice',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '户',
    col: 12,
  },
  {
    key: 'communityName',
    label: '配备电梯',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
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
    key: 'totalPrice',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '共',
    col: 12,
  },
  {
    key: 'totalPrice',
    label: 'none',
    type: 'input',
    placeholder: '请输入',
    unit: '层',
    col: 12,
  },

  {
    key: 'communityName',
    label: '交房时间',
    type: 'input',
    placeholder: '请输入',
    col: 24,
  },

  {
    key: 'communityName',
    label: '房屋用途',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
    col: 24,
  },

  {
    key: 'communityName',
    label: '户口',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
    col: 24,
  },

  {
    key: 'communityName',
    label: '产权情况',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
    col: 24,
  },

  {
    key: 'communityName',
    label: '特色标签（多选，最多六个）',
    type: 'select',
    placeholder: '请选择',
    options: [
      { label: '一室一厅', value: '一室一厅' },
      { label: '一室两厅', value: '一室两厅' },
      { label: '两室一厅', value: '两室一厅' },
    ],
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
    key: 'communityName',
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
    key: 'communityName',
    label: '房源轮播图',
    type: 'upload',
    maxCount: 6,
    col: 24,
    weight: 'bold',
    desc: '第一张图作为封面，可多图上传，最多6张 /n 建议尺寸750*750像素，最大3M',
  },

  {
    key: 'communityName',
    label: '户型图',
    type: 'upload',
    maxCount: 6,
    col: 24,
    weight: 'bold',
    desc: '可多图上传，最多6张 /n 建议尺寸750*750像素，最大3M',
  },
  {
    key: 'videourl',
    label: '视频',
    type: 'upload-video',
    maxCount: 6,
    col: 24,
    weight: 'bold',
    desc: '可上传两分以内的视频',
  },
  {
    key: 'communityName',
    label: 'VR地址',
    type: 'input',
    col: 24,
    weight: 'bold',
    placeholder: '请输入',
  },
  {
    key: 'communityName',
    label: '智能锁配置',
    type: 'none',
    col: 24,
    weight: 'bold',
  },
  {
    key: 'communityName',
    label: '门锁MAC',
    type: 'input',
    col: 24,
    placeholder: '请输入',
  },
  {
    key: 'communityName',
    label: '门锁管理员编码',
    type: 'input',
    col: 24,
    placeholder: '请输入',
  },

  {
    key: 'communityName',
    label: '项目联系人',
    type: 'none',
    col: 24,
    weight: 'bold',
  },
  {
    key: 'communityName',
    label: '姓名',
    type: 'input',
    col: 24,
    placeholder: '请输入',
  },
  {
    key: 'communityName',
    label: '电话',
    type: 'input',
    inputType: 'number',
    col: 24,
    placeholder: '请输入',
  },
  {
    key: 'communityName',
    label: '佣金',
    type: 'input',
    inputType: 'digit',
    col: 24,
    weight: 'bold',
    placeholder: '请输入',
  },
]
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .content {
    padding-bottom: calc(env(safe-area-inset-bottom) + 220rpx);
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
