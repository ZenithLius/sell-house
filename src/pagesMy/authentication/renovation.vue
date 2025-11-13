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
      <view v-if="currentRole === 'renovation'" class="btn"
        ><view @tap="handleAddRecord" class="head-btn">+ 添加记录</view></view
      >
      <ShCustomForm
        v-if="currentRole !== 'manager' && currentRole !== 'renovation'"
        v-model="formData"
        :fields="fields"
        @fieldChangeSearch="handleFieldChangeSearch"
        @fieldChange="handleFieldChange"
      />

      <ShFormView v-else :modelValue="formData" :fields="fields2" :showAsteriskForRequired="true" />

      <CollapsePanel :items="collapseItems" class="collapse-section" />
      <!-- 底部 -->
      <AuditProgress :completionAudit="completionAuditData" :paymentAudit="paymentAuditData" />
      <ShBottomBtns
        v-if="currentRole === 'manager'"
        backgroundColor="#fff"
        :buttons="bottomButtons"
        @click="handleButtonClick"
        paddingBottom="40"
        :fixed="false"
      />
      <view class="space"></view>
    </view>

    <!-- <BottomTabbar v-if="currentRole !== 'renovation'" /> -->
  </view>
</template>

<script setup lang="ts">
import ShCustomForm from '@/components/ShCustomForm.vue'
import type { CustomFormField } from '@/types/customFormField'
import BottomTabbar from './components/BottomTabbar.vue'
import CollapsePanel from './components/CollapsePanel.vue'
import type { CollapseItem } from './components/CollapsePanel.vue'
import AuditProgress from './components/AuditProgress.vue'
import type { AuditInfo } from './components/AuditProgress.vue'
import { ref } from 'vue'
import {
  assignProjectManagerAPI,
  decorationRecordListAPI,
  investorListAPI,
} from '../services/staff'
import { onLoad } from '@dcloudio/uni-app'

/**
 * ==========================================================================
 *                                 @异步请求相关
 * ==========================================================================
 */

/**
 * ==================================获取表单装修负责人数据========================================
 */
const fields = ref<any[]>([
  {
    key: 'user_id',
    label: '',
    type: 'selectSearch',
    head: '装修负责人：',
    placeholder: '',
    options: [],
    required: false,
  },
])
const fields2: CustomFormField[] = [
  {
    key: 'communityName',
    label: 'none',
    type: 'input',
    head: '装修负责人：',
  },
]
const keyWord = ref('')
// 设置装修负责人
const handleFieldChange = (key: string, value: any) => {
  userId.value = value
  // getDecorationRecordListReq()
  setAssignProjectManagerReq()
}
const setAssignProjectManagerReq = async () => {
  const params = {
    house_list_id: currentHouseListId.value,
    project_manager_user_id: userId.value,
  }
  const res = await assignProjectManagerAPI(params)
}
const handleFieldChangeSearch = (value: any) => {
  keyWord.value = value
  getInvestorListReq()
}

const getInvestorListReq = async () => {
  const params = {
    keyword: keyWord.value,
    type: 3,
    // 1投资人，2经纪人，3装修负责人
  }
  const res = await investorListAPI(params)

  const target = fields.value.find((f) => f.key === 'user_id')

  if (target) {
    target.options = res.data.list
  }
}

/**
 * ==================================装修记录========================================
 */

const getDecorationRecordListReq = async () => {
  const params = {
    house_list_id: currentHouseListId.value,
    user_id: userId.value,
  }
  const res = await decorationRecordListAPI(params)
}
const handleAddRecord = () => {
  uni.navigateTo({
    url: '/pagesRenovation/addRecord',
  })
}
const currentHouseListId = ref<string | number>('')
const userId = ref<string | number>('')
onLoad((options) => {
  currentHouseListId.value = options?.house_list_id || ''
  userId.value = options?.user_id || ''

  getDecorationRecordListReq()
  getInvestorListReq()
})

const bottomButtons = [
  {
    text: '审核',
    background: '#863fce',
    color: '#ffffff',
  },
]
const handleButtonClick = (index: number) => {
  if (index === 0) {
    console.log('保存/修改')
  } else if (index === 1) {
    console.log('续约')
  }
}

const currentRole = uni.getStorageSync('currentOtherManageType')

const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}
const formData = ref({
  communityName: 'liming',
})

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
  .btn {
    display: flex;
    justify-content: flex-end;
    padding: 0 30rpx;
  }
  .head-btn {
    width: 146rpx;
    height: 46rpx;
    background: #863fce;
    border-radius: 23rpx;
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 22rpx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.collapse-section {
  margin-top: 32rpx;
}
</style>
