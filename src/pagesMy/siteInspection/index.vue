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
      <ShCustomForm v-model="formData" :fields="fields" />
    </view>

    <BottomTabbar />
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
]
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
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
