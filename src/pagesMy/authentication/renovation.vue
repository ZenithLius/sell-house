<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'装修记录'"
      :showBack="true"
      class="navbar-fixed"
    />
    <view class="content" :style="{ paddingTop: safeAreaInsets!.top +40+ 'px' }">
      <ShCustomForm v-model="formData" :fields="fields" />
      <CollapsePanel :items="collapseItems" class="collapse-section" />
      <!-- 底部 -->
      <AuditProgress :completionAudit="completionAuditData" :paymentAudit="paymentAuditData" />
      <view class="space"></view>
    </view>
    <BottomTabbar />
  </view>
</template>

<script setup lang="ts">
import ShCustomForm from '@/components/ShCustomForm.vue'
import type { CustomFormField } from '@/types/customFormField'
import BottomTabbar from './components/BottomTabbar.vue'
import CollapsePanel from './components/CollapsePanel.vue'
import type { CollapseItem, StageItem } from './components/CollapsePanel.vue'
import AuditProgress from './components/AuditProgress.vue'
import type { AuditInfo } from './components/AuditProgress.vue'
import { ref } from 'vue'

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}
const formData = ref({
  communityName: '',
})

const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: '',
    type: 'selectSearch',
    head: '装修负责人：',
    placeholder: '',
    options: [
      { label: '负责人1', value: '1', phone: '12345678901' },
      { label: '负责人2', value: '2', phone: '12345678902' },
      { label: '负责人3', value: '3', phone: '12345678903' },
      { label: '负责人4', value: '4', phone: '12345678904' },
    ],
    required: false,
  },
]

// 审核进度数据
const completionAuditData = ref<AuditInfo>({
  status: '审核通过',
  time: '2025-10-10 10:00',
  auditor: '张三',
})

const paymentAuditData = ref<AuditInfo>({
  status: '审核通过',
  time: '2025-10-10 10:00',
  auditor: '李四',
})

const collapseItems = ref<CollapseItem[]>([
  {
    title: '墙面翻修',
    status: '已完成',
    stages: [
      {
        time: '2025.09.04 10:00:00',
        status: '已完成',
        title: '已完成',
        person: '张三',
        material: '证明材料',
        images: [
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        ],
      },
      {
        time: '2025.09.04 10:00:00',
        status: '已完成-50%',
        title: '已完成-50%',
        person: '张三',
        material: '证明材料',
        images: [
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
        ],
      },
      {
        time: '2025.09.04 10:00:00',
        status: '未完成',
        title: '未完成',
        person: '张三',
        material: '证明材料',
        images: [
          'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
        ],
      },
    ],
  },
  { title: '灯具安装', status: '未开始', content: '' },
  { title: '拆除', status: '未开始', content: '' },
  { title: '垃圾清运', status: '未开始', content: '' },
  { title: '厨柜改造', status: '未开始', content: '' },
  { title: '门窗换新', status: '未开始', content: '' },
  { title: '踢脚线', status: '未开始', content: '' },
  { title: '吊顶', status: '未开始', content: '' },
])
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .space {
    height: calc(env(safe-area-inset-bottom) + 100rpx);
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

.collapse-section {
  margin-top: 32rpx;
}
</style>
