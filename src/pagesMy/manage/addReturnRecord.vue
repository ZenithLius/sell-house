<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'新增回款'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <ShCustomForm v-model="formData" :fields="fields" :has-bottom-tabbar="false" />
      <ShBottomBtns
        backgroundColor="#fff"
        :fixed="false"
        paddingBottom="20"
        :buttons="bottomButtons"
        @click="handleButtonClick"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CustomFormField } from '@/types/customFormField'
const { safeAreaInsets } = uni.getSystemInfoSync()
const bottomButtons = [
  {
    text: '提交',
    background: '#863fce',
    color: '#ffffff',
  },
]

const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('保存/修改')
  }
}
const fields: CustomFormField[] = [
  {
    key: 'region',
    label: '回款状态',
    type: 'select',
    placeholder: '请选择',
    options: [{ label: '新城区', value: '1' }],
  },
  { key: 'communityName', label: '收房人', type: 'input', placeholder: '请输入' },
  { key: 'area', label: '出房人', type: 'input', placeholder: '请输入' },
  { key: 'price', label: '出房时间', type: 'date', placeholder: '请输入' },
  { key: 'price', label: '回款时间', type: 'date', placeholder: '请输入' },
  {
    key: 'region',
    label: '收房合同价',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '实际收房价',
    type: 'input',
    placeholder: '请输入',
    unit: '元',
  },
  {
    key: 'region',
    label: '收房中介费',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '收房成交奖',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '出房价',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '出房中介费',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '出房成交奖',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '装修成本',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '物业水电费',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '营销费',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '其他费用',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '利润',
    type: 'input',
    placeholder: '',
    unit: '123.00元',
  },
  {
    key: 'region',
    label: '回款金额',
    type: 'input',
    placeholder: '请输入',
    unit: '元',
  },
  {
    key: 'region',
    label: '备注',
    type: 'textarea',
    placeholder: '请输入',
  },
]

const formData = ref({
  communityName: '',
  area: '',
  price: '',
  region: '',
  address: '',
  customerName: '',
  phone: '',
})

const handleBack = () => {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .content {
    padding-bottom: env(safe-area-inset-bottom);
  }
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
