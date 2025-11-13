<template>
  <view class="container">
    <ShNavbar
      @back="handleBack"
      v-show="true"
      :title="'签约'"
      :showBack="true"
      class="navbar-fixed"
    />
    <scroll-view
      class="content"
      scroll-y
      :style="{ paddingTop: safeAreaInsets!.top +40+ 'px', paddingBottom:safeAreaInsets!.bottom + 100+'rpx' }"
    >
      <ShCustomForm
        v-if="currentRole !== 'manager'"
        v-model="formDataStaff"
        :fields="fieldsStaff"
      />
      <ShFormView v-else :modelValue="formData" :fields="fields" :showAsteriskForRequired="true" />
    </scroll-view>

    <ShBottomBtns
      :paddingBottom="20"
      backgroundColor="#fff"
      :buttons="bottomButtons"
      @click="handleButtonClick"
    />
    <!-- <BottomTabbar /> -->
  </view>
</template>

<script setup lang="ts">
import type { CustomFormField } from '@/types/customFormField'
import BottomTabbar from './components/BottomTabbar.vue'
import ShBottomBtns from '@/components/ShBottomBtns.vue'
import { computed, ref } from 'vue'
import ShFormView from '@/components/ShFormView.vue'
import { onLoad } from '@dcloudio/uni-app'
import { signAPI, signDetailAPI } from '../services/staff'

type IdCardValue = {
  front?: string
  back?: string
}

interface FormDataStaff {
  begin_time: string
  end_time: string
  contract_img: string[]
  idcard_font_img: IdCardValue
  idcard_back_img: string[]
  deed_img: string[]
}

const currentRole = uni.getStorageSync('currentOtherManageType')

const formData = ref({
  communityName: '123233333',
  area: '12323',
  price: '123123',
  region: '123123',
  address: '123123',
  customerName: '123123',
  phone: '123123',
  photos: [
    'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  ],
  idcard: {
    front: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    back: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
  },
})

const formDataStaff = ref<FormDataStaff>({
  begin_time: '',
  end_time: '',
  contract_img: [], //合同照片
  idcard_font_img: { front: '', back: '' }, //身份证正反面
  idcard_back_img: [], //身份证背面照片（保留字段，未直接绑定表单）
  deed_img: [], //房产证照片
})

const fieldsStaff: CustomFormField[] = [
  {
    key: 'begin_time',
    label: '合同签约时间',
    type: 'date',
    head: '收房时间：',
  },
  {
    key: 'end_time',
    label: 'none',
    head: '到期时间：',
    type: 'date',
  },
  { key: 'contract_img', label: '合同', type: 'upload', maxCount: 9 },

  { key: 'deed_img', label: '业主房产证', type: 'upload', maxCount: 9 },
  { key: 'idcard_font_img', label: '身份证正反面', type: 'idCard' },
]

const fields: CustomFormField[] = [
  {
    key: 'communityName',
    label: 'none',
    head: '收房时间：',
    type: 'date',
  },
  {
    key: 'communityName',
    label: 'none',
    head: '到期时间：',
    type: 'date',
  },
  { key: 'photos', label: '合同', type: 'upload', maxCount: 9 },

  { key: 'photos', label: '业主房产证', type: 'upload', maxCount: 9 },
  { key: 'idcard', label: '身份证正反面', type: 'idCard' },
]
const { safeAreaInsets } = uni.getSystemInfoSync()
const handleBack = () => {
  uni.navigateBack()
}

const bottomButtons = computed(() => {
  console.log('currentRolejisaunshuxing1', currentRole)
  if (currentRole === 'manager') {
    return [
      {
        text: '取消',
        background: '#fff',
        color: '#863fce',
      },
    ]
  } else {
    if (isSigned.value) {
      return [
        {
          text: '续约',
          background: '#863fce',
          color: '#ffffff',
        },
      ]
    } else {
      return [
        {
          text: '保存/修改',
          background: '#863fce',
          color: '#ffffff',
        },
      ]
    }
  }
})
const houseListId = ref<string | number | undefined>(undefined)

/**
 * 表单校验
 */
const validateForm = (): { valid: boolean; message: string } => {
  const form = formDataStaff.value

  // 校验收房时间
  if (!form.begin_time) {
    return { valid: false, message: '请选择收房时间' }
  }

  // 校验到期时间
  if (!form.end_time) {
    return { valid: false, message: '请选择到期时间' }
  }

  // 校验到期时间是否大于收房时间
  const beginTime = new Date(form.begin_time).getTime()
  const endTime = new Date(form.end_time).getTime()
  if (endTime <= beginTime) {
    return { valid: false, message: '到期时间必须大于收房时间' }
  }

  // 校验合同照片
  if (!form.contract_img || form.contract_img.length === 0) {
    return { valid: false, message: '请上传合同照片' }
  }

  // 校验业主房产证
  if (!form.deed_img || form.deed_img.length === 0) {
    return { valid: false, message: '请上传业主房产证' }
  }

  // 校验身份证正反面
  if (!form.idcard_font_img?.front || !form.idcard_font_img?.back) {
    return { valid: false, message: '请上传身份证正反面' }
  }

  return { valid: true, message: '' }
}

const handleButtonClick = async (index: number) => {
  if (index === 0) {
    // 表单校验
    const validation = validateForm()
    if (!validation.valid) {
      uni.showToast({
        title: validation.message,
        icon: 'none',
        duration: 2000,
      })
      return
    }

    const params = {
      house_list_id: houseListId.value,
      begin_time: formDataStaff.value.begin_time,
      end_time: formDataStaff.value.end_time,
      contract_img: formDataStaff.value.contract_img.join(','),
      idcard_font_img: formDataStaff.value.idcard_font_img!.front,
      idcard_back_img: formDataStaff.value.idcard_font_img!.back,
      deed_img: formDataStaff.value.deed_img.join(','),
      id: '',
    }

    uni.showLoading({
      title: '保存中',
    })

    try {
      const res = await signAPI(params)
      uni.hideLoading()

      if (res.code === 200) {
        uni.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500,
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      } else {
        uni.showToast({
          title: res.msg || '保存失败',
          icon: 'none',
          duration: 2000,
        })
      }
    } catch (error) {
      uni.hideLoading()
      uni.showToast({
        title: '保存失败，请重试',
        icon: 'none',
        duration: 2000,
      })
    }
  } else if (index === 1) {
    console.log('续约')
  }
}

onLoad((options) => {
  houseListId.value = options?.house_list_id
  signDetailReq()
})

const isSigned = ref(false)
/**
 * ==================================签约详情查看========================================
 */
const signDetailReq = async () => {
  uni.showLoading({
    title: '加载中',
  })

  try {
    const res = await signDetailAPI({ id: houseListId.value })
    uni.hideLoading()

    if (res.code !== 200 || !res.data) {
      return
    }

    // 判断是否已签约
    isSigned.value = !!res.data.id

    // 填充表单数据
    if (res.data.id) {
      formDataStaff.value = {
        begin_time: res.data.begin_time || '',
        end_time: res.data.end_time || '',
        contract_img: res.data.contract_img ? res.data.contract_img.split(',') : [],
        deed_img: res.data.deed_img ? res.data.deed_img.split(',') : [],
        idcard_font_img: {
          front: res.data.idcard_font_img || '',
          back: res.data.idcard_back_img || '',
        },
        idcard_back_img: [],
      }
    }
  } catch (error) {
    uni.hideLoading()
    console.error('获取签约详情失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 20rpx;
  background: #fff;
  .content {
    height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 30rpx);
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
