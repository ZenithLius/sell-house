<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { uploadFileAPI } from '@/services/upload'

const { safeAreaInsets } = uni.getSystemInfoSync()
interface OptionItem {
  title: string
  id: any
  nickname: string
  mobile?: string
  phone?: string
}

interface FieldConfig {
  head?: string
  key: string
  label: string
  type?:
    | 'input'
    | 'textarea'
    | 'select'
    | 'date'
    | 'upload'
    | 'upload-video'
    | 'idCard'
    | 'selectSearch'
    | 'none'
    | 'radio'
    | 'radio-group'
    | 'line'
    | 'select-multiple'
  placeholder?: string
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  unit?: string
  required?: boolean
  options?: OptionItem[]
  maxCount?: number
  visible?: boolean | ((form: Record<string, any>) => boolean)
  showLabel?: boolean
  col?: number
  radioLabel?: string
  radioKey?: string
  weight?: 'normal' | 'bold'
  desc?: string
}

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    fields: FieldConfig[]
    showAsteriskForRequired?: boolean
    hasBottomTabbar?: boolean
  }>(),
  {
    showAsteriskForRequired: true,
    hasBottomTabbar: true,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: Record<string, any>): void
  (e: 'fieldChange', key: string, value: any): void
  (e: 'sendCode', phone: string): void
  (e: 'fieldChangeSearch', value: any): void
}>()

const form = ref<Record<string, any>>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (v) => {
    Object.assign(form.value, v)
  },
  { deep: true },
)

watch(
  form,
  (v) => {
    emit('update:modelValue', { ...v })
  },
  { deep: true },
)

const getSelectedLabel = (field: FieldConfig) => {
  const val = form.value[field.key]
  const opt = field.options?.find((o) => o.id === val)
  return opt?.title ?? ''
}

const getMultipleSelectedLabel = (field: FieldConfig) => {
  const vals = form.value[field.key]
  if (!Array.isArray(vals) || !field.options || field.options.length === 0) return ''
  const map = new Map(field.options.map((o) => [o.id, o.title]))
  const labels = vals.map((v: any) => map.get(v)).filter(Boolean) as string[]
  return labels.join('、')
}

const fieldVisible = (field: FieldConfig) => {
  const v: any = field.visible
  if (typeof v === 'function') return v(form.value)
  if (typeof v === 'boolean') return v
  return true
}

// 根据 visible 过滤可展示的字段
const renderFields = computed(() => props.fields.filter((f) => fieldVisible(f)))

// 弹性布局表单项
const renderBlocks = computed(() => {
  const blocks: Array<
    { type: 'single'; field: FieldConfig } | { type: 'grid'; cols: number; fields: FieldConfig[] }
  > = []
  const list = renderFields.value
  let current: FieldConfig[] = []
  let used = 0

  const width24 = (f: FieldConfig) => {
    const v = Number((f as any).col)
    if (!isFinite(v) || v <= 0) return 24
    return Math.max(1, Math.min(24, Math.floor(v)))
  }

  for (const f of list) {
    const w = width24(f)
    if (used + w > 24) {
      if (current.length) blocks.push({ type: 'grid', cols: current.length, fields: current })
      current = [f]
      used = w
    } else {
      current.push(f)
      used += w
    }

    if (used === 24) {
      blocks.push({ type: 'grid', cols: current.length, fields: current })
      current = []
      used = 0
    }
  }

  if (current.length) {
    blocks.push({ type: 'grid', cols: current.length, fields: current })
  }

  return blocks
})

const getGridTemplate = (block: { cols: number; fields: FieldConfig[] }) => {
  const widths = block.fields.map((f) => {
    const v = Number((f as any).col)
    const w = !isFinite(v) || v <= 0 ? 24 : Math.max(1, Math.min(24, Math.floor(v)))
    return `${(w / 24) * 100}%`
  })
  return widths.join(' ')
}

// const onSelectChange = (field: FieldConfig, e: any) => {
//   const index = e?.detail?.value ?? 0
//   const opt = field.options?.[index]
//   const val = opt ? opt.id : undefined
//   form.value[field.key] = val
//   emit('fieldChange', field.key, val)
// }

//TODO UI跟后台接口校验不一致。目前在父组件单独做冗余处理。后期可使用加必填选项自动校验
const validate = () => {
  const errors: { key: string; label: string; message: string }[] = []
  props.fields.forEach((f) => {
    if (f.required) {
      const v = form.value[f.key]
      let empty = false

      if (f.type === 'idCard') {
        // 身份证需要检查 front 和 back 是否都有值
        empty = !v || !v.front || !v.back
      } else if (f.type === 'upload' || f.type === 'upload-video') {
        // 图片/视频上传需要检查数组是否为空
        empty = !v || !Array.isArray(v) || v.length === 0
      } else if (f.type === 'select-multiple') {
        // 多选需要检查数组是否为空
        empty = !v || !Array.isArray(v) || v.length === 0
      } else {
        // 其他类型的常规检查
        empty = v === undefined || v === null || (typeof v === 'string' && v.trim() === '')
      }

      if (empty) {
        errors.push({ key: f.key, label: f.label, message: `${f.label}为必填项` })
      }
    }
  })
  return { valid: errors.length === 0, errors }
}

const getData = () => ({ ...form.value })

// date 选择器相关
const onDateChange = (field: FieldConfig, value: any) => {
  const dateValue = Array.isArray(value) ? value[0] : String(value)
  form.value[field.key] = dateValue
  emit('fieldChange', field.key, dateValue)
}

// 图片上传相关
const chooseImage = (field: FieldConfig) => {
  const currentImages = form.value[field.key] || []
  const maxCount = field.maxCount || 9
  const remaining = maxCount - currentImages.length

  if (remaining <= 0) {
    uni.showToast({
      title: `最多上传${maxCount}张图片`,
      icon: 'none',
    })
    return
  }

  uni.chooseImage({
    count: remaining,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      try {
        const tempFilePaths: string[] = Array.isArray(res.tempFilePaths)
          ? res.tempFilePaths
          : [res.tempFilePaths as string]
        uni.showLoading({ title: '上传中...', mask: true })
        const uploads = tempFilePaths.map((p) => uploadFileAPI(p))
        const results = await Promise.all(uploads)
        const urls = results.map((r: any) => r?.data?.url || '').filter((u: string) => !!u)
        const newImages = [...currentImages, ...urls].slice(0, maxCount)
        form.value[field.key] = newImages
        emit('fieldChange', field.key, newImages)
        uni.showToast({ title: '上传成功', icon: 'success' })
      } catch (e) {
        uni.showToast({ title: '上传失败，请重试', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  })
}

const removeImage = (field: FieldConfig, index: number) => {
  const currentImages = form.value[field.key] || []
  currentImages.splice(index, 1)
  form.value[field.key] = [...currentImages]
  emit('fieldChange', field.key, form.value[field.key])
}

const previewImage = (field: FieldConfig, index: number) => {
  const images = form.value[field.key] || []
  uni.previewImage({
    current: index,
    urls: images,
  })
}

// 身份证上传相关
const chooseIdCard = (field: FieldConfig, side: 'front' | 'back') => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      if (!form.value[field.key]) {
        form.value[field.key] = {}
      }
      form.value[field.key][side] = tempFilePath
      emit('fieldChange', field.key, form.value[field.key])
    },
  })
}

const previewIdCard = (imagePath: string) => {
  if (!imagePath || imagePath.includes('/static/')) {
    return
  }
  uni.previewImage({
    current: 0,
    urls: [imagePath],
  })
}

const removeIdCard = (field: FieldConfig, side: 'front' | 'back') => {
  if (form.value[field.key] && form.value[field.key][side]) {
    delete form.value[field.key][side]
    emit('fieldChange', field.key, form.value[field.key])
  }
}

// 视频上传相关
const chooseVideo = (field: FieldConfig) => {
  const currentVideos = form.value[field.key] || []
  const maxCount = field.maxCount || 1
  const remaining = maxCount - currentVideos.length

  if (remaining <= 0) {
    uni.showToast({
      title: `最多上传${maxCount}个视频`,
      icon: 'none',
    })
    return
  }

  uni.chooseVideo({
    count: 1,
    sourceType: ['album', 'camera'],
    maxDuration: 60,
    camera: 'back',
    success: async (res: any) => {
      try {
        uni.showLoading({ title: '上传中...', mask: true })
        const uploadRes: any = await uploadFileAPI(res.tempFilePath)
        const url = uploadRes?.data?.url || uploadRes?.result?.url || ''
        if (!url) throw new Error('上传失败')
        const video = {
          url,
          duration: res.duration,
        }
        const newVideos = [...currentVideos, video].slice(0, maxCount)
        form.value[field.key] = newVideos
        emit('fieldChange', field.key, newVideos)
        uni.showToast({ title: '上传成功', icon: 'success' })
      } catch (e) {
        uni.showToast({ title: '上传失败，请重试', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },
  })
}

const removeVideo = (field: FieldConfig, index: number) => {
  const currentVideos = form.value[field.key] || []
  currentVideos.splice(index, 1)
  form.value[field.key] = [...currentVideos]
  emit('fieldChange', field.key, form.value[field.key])
}

const previewVideo = (video: any) => {
  // 预览视频
  uni.previewMedia({
    sources: [
      {
        url: video.url,
        type: 'video',
      },
    ],
    current: 0,
  })
}

// uni-popup 相关
const popupRef = ref<any>(null)
const currentField = ref<FieldConfig | null>(null)
const tempSelectedValue = ref<any>(null)

// select-multiple 弹窗相关
const multiPopupRef = ref<any>(null)
const currentMultiField = ref<FieldConfig | null>(null)
const tempSelectedValues = ref<any[]>([])

// selectSearch 弹窗相关
const searchPopupRef = ref<any>(null)
const currentSearchField = ref<FieldConfig | null>(null)
const searchKeyword = ref('')
const searchList = ref<any[]>([])
const searchLoading = ref(false)
const searchHasMore = ref(true)
const selectedSearchId = ref<string | number | undefined>(undefined)

const openSelectPopup = (field: FieldConfig) => {
  currentField.value = field
  tempSelectedValue.value = form.value[field.key]
  popupRef.value?.open('bottom')
}

const closePopup = () => {
  popupRef.value?.close()
  currentField.value = null
  tempSelectedValue.value = null
}

const confirmSelect = () => {
  if (currentField.value) {
    form.value[currentField.value.key] = tempSelectedValue.value
    emit('fieldChange', currentField.value.key, tempSelectedValue.value)
  }
  closePopup()
}

const selectOption = (option: OptionItem) => {
  tempSelectedValue.value = option.id
}

const openMultiSelectPopup = (field: FieldConfig) => {
  currentMultiField.value = field
  const cur = form.value[field.key]
  tempSelectedValues.value = Array.isArray(cur) ? [...cur] : []
  multiPopupRef.value?.open('bottom')
}

const closeMultiPopup = () => {
  multiPopupRef.value?.close()
  currentMultiField.value = null
  tempSelectedValues.value = []
}

const toggleMultiOption = (option: OptionItem) => {
  const idx = tempSelectedValues.value.findIndex((v) => v === option.id)
  if (idx > -1) {
    tempSelectedValues.value.splice(idx, 1)
  } else {
    const max = currentMultiField.value?.maxCount ?? Infinity
    if (tempSelectedValues.value.length >= max) {
      if (isFinite(max)) uni.showToast({ title: `最多选择${max}个`, icon: 'none' })
      return
    }
    tempSelectedValues.value.push(option.id)
  }
}

const confirmMultiSelect = () => {
  if (currentMultiField.value) {
    const vals = [...tempSelectedValues.value]
    form.value[currentMultiField.value.key] = vals
    emit('fieldChange', currentMultiField.value.key, vals)
  }
  closeMultiPopup()
}

// selectSearch 相关方法
const openSearchPopup = (field: FieldConfig) => {
  currentSearchField.value = field
  selectedSearchId.value = form.value[field.key]
  // 初始化搜索列表
  searchKeyword.value = ''
  searchList.value =
    field.options?.map((opt, idx) => ({
      id: opt.id,
      name: opt.nickname || opt.title || '',
      phone: opt.mobile || opt?.phone || '',
    })) || []
  searchHasMore.value = false
  searchPopupRef.value?.open('bottom')
}

const closeSearchPopup = () => {
  searchPopupRef.value?.close()
  currentSearchField.value = null
  selectedSearchId.value = undefined
  searchKeyword.value = ''
  searchList.value = []
}

const confirmSearchSelect = () => {
  if (currentSearchField.value && selectedSearchId.value !== undefined) {
    form.value[currentSearchField.value.key] = selectedSearchId.value
    emit('fieldChange', currentSearchField.value.key, selectedSearchId.value)
  }
  closeSearchPopup()
}

const handleSearchKeyword = (keyword: string) => {
  // if (currentSearchField.value?.options) {
  //   const filtered = currentSearchField.value.options.filter((opt) =>
  //     opt.nickname.toLowerCase().includes(keyword.toLowerCase()),
  //   )
  //   searchList.value = filtered.map((opt) => ({
  //     id: opt.id,
  //     name: opt.nickname,
  //     phone: opt.mobile,
  //   }))
  // }
  emit('fieldChangeSearch', keyword)
}

const handleLoadMoreSearch = () => {
  console.log('加载更多=====')
}

const handleSelectSearchItem = (id: string | number) => {
  selectedSearchId.value = id
}

const getSearchSelectedLabel = (field: FieldConfig) => {
  const val = form.value[field.key]
  const opt = field.options?.find((o) => o.id === val)
  return opt?.nickname ?? opt?.title ?? ''
}

watch(
  () => currentSearchField.value?.options,
  (opts) => {
    if (!currentSearchField.value) return
    const list = Array.isArray(opts) ? opts : []
    searchList.value = list.map((opt: any) => ({
      id: opt.id,
      name: opt.nickname || opt.title || '',
      phone: opt.mobile || opt.phone || '',
    }))
    searchHasMore.value = false
  },
  { deep: true },
)

// 发送验证码倒计时
const countdown = ref(0)
const isCounting = ref(false)
let timer: any = null

const sendCode = () => {
  if (!form.value.mobile) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none',
    })
    return
  }
  if (!/^1[3-9]\d{9}$/.test(form.value.mobile)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none',
    })
    return
  }
  emit('sendCode', form.value.mobile)
  if (isCounting.value) {
    return
  }

  countdown.value = 59
  isCounting.value = true

  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCounting.value = false
      countdown.value = 0
    }
  }, 1000)
}

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})

defineExpose({ validate, getData })
</script>

<template>
  <view class="form">
    <template v-for="(block, bi) in renderBlocks" :key="bi">
      <template v-if="block.type === 'single'">
        <view class="form-item">
          <view
            v-if="block.field.label !== 'none' && block.field.showLabel !== false"
            class="label"
            :class="{ 'weight-bold': block.field.weight === 'bold' }"
          >
            {{ block.field.label }}
            <text v-if="props.showAsteriskForRequired && block.field.required" style="color: red"
              >*</text
            >
          </view>

          <view v-if="block.field.desc" class="desc">
            <image src="@/pagesMy/static/alert.png" mode="aspectFill" class="desc-image"></image>
            <text>{{ block.field.desc.replace(/\/n/g, '\n') }}</text>
          </view>

          <view v-if="block.field.type === 'line'" class="line"></view>

          <template v-if="(block.field.type || 'input') === 'input'">
            <view class="name-gender-row">
              <input
                v-model="form[block.field.key]"
                class="input-style"
                :type="block.field.inputType || 'text'"
                :password="block.field.password === true"
                :placeholder="block.field.placeholder || '请输入'"
                placeholder-style="color:#999"
                :cursor-spacing="20"
              />
              <text v-if="block.field.unit" class="unit">{{ block.field.unit }}</text>
            </view>
          </template>

          <template v-else-if="(block.field.type || 'code') === 'code'">
            <view class="name-gender-row">
              <input
                v-model="form[block.field.key]"
                class="input-style"
                :type="block.field.inputType || 'text'"
                :password="block.field.password === true"
                :placeholder="block.field.placeholder || '请输入'"
                placeholder-style="color:#999"
                :cursor-spacing="20"
              />
              <text @click="sendCode" class="unit" :class="{ 'unit-disabled': isCounting }">
                {{ isCounting ? `已发送（${countdown}s）` : '发送验证码' }}
              </text>
            </view>
          </template>

          <template v-else-if="block.field.type === 'textarea'">
            <view class="textarea-wrapper">
              <textarea
                v-model="form[block.field.key]"
                class="textarea"
                :placeholder="block.field.placeholder || '请输入'"
                placeholder-style="color:#999"
                auto-height
                :maxlength="500"
                :cursor-spacing="20"
              />
              <view class="textarea-counter"> {{ (form[block.field.key] || '').length }}/500 </view>
            </view>
          </template>

          <template v-else-if="block.field.type === 'select'">
            <view class="name-gender-row" @click="openSelectPopup(block.field)">
              <text v-if="block.field.head" class="input-styles" :style="{ color: '#333' }">
                {{ block.field.head }}
              </text>
              <text
                class="input-style"
                :style="{ color: getSelectedLabel(block.field) ? '#333' : '#999' }"
              >
                {{ getSelectedLabel(block.field) || block.field.placeholder || '' }}
              </text>
              <text v-if="block.field.unit" class="unit">{{ block.field.unit }}</text>
              <image class="arrow-icon" src="/static/house/right.png" mode="aspectFit"></image>
            </view>
          </template>

          <template v-else-if="block.field.type === 'select-multiple'">
            <view class="name-gender-row" @click="openMultiSelectPopup(block.field)">
              <text v-if="block.field.head" class="input-styles" :style="{ color: '#333' }">
                {{ block.field.head }}
              </text>
              <text
                class="input-style"
                :style="{ color: getMultipleSelectedLabel(block.field) ? '#333' : '#999' }"
              >
                {{ getMultipleSelectedLabel(block.field) || block.field.placeholder || '' }}
              </text>
              <text v-if="block.field.unit" class="unit">{{ block.field.unit }}</text>
              <image class="arrow-icon" src="/static/house/right.png" mode="aspectFit"></image>
            </view>
          </template>

          <template v-else-if="block.field.type === 'selectSearch'">
            <view class="name-gender-row" @click="openSearchPopup(block.field)">
              <text v-if="block.field.head" class="input-styles" :style="{ color: '#333' }">
                {{ block.field.head }}
              </text>
              <text
                class="input-style"
                :style="{ color: getSearchSelectedLabel(block.field) ? '#333' : '#999' }"
              >
                {{ getSearchSelectedLabel(block.field) || block.field.placeholder || '' }}
              </text>
              <image class="arrow-icon" src="/static/house/right.png" mode="aspectFit"></image>
            </view>
          </template>

          <template v-else-if="block.field.type === 'date'">
            <view class="name-gender-row">
              <uni-datetime-picker
                v-model="form[block.field.key]"
                type="date"
                :clear-icon="false"
                :placeholder="block.field.placeholder || '请选择日期'"
                @change="onDateChange(block.field, $event)"
              >
                <template #default>
                  <view class="date-picker-content">
                    <text v-if="block.field.head" class="input-styles" :style="{ color: '#333' }">
                      {{ block.field.head }}
                    </text>
                    <text
                      class="input-style"
                      :style="{ color: form[block.field.key] ? '#333' : '#999' }"
                    >
                      {{ form[block.field.key] || '请选择日期' }}
                    </text>
                  </view>
                </template>
              </uni-datetime-picker>
              <image class="date-icon" src="@/pagesMy/static/date.png" mode="aspectFit"></image>
            </view>
          </template>

          <template v-else-if="block.field.type === 'upload'">
            <view class="upload-container">
              <view
                v-for="(img, imgIdx) in form[block.field.key] || []"
                :key="imgIdx"
                class="upload-item"
                @click="previewImage(block.field, imgIdx)"
              >
                <image :src="img" mode="aspectFill" class="upload-image"></image>
                <view class="delete-btn" @click.stop="removeImage(block.field, imgIdx)">
                  <text class="delete-icon">×</text>
                </view>
              </view>
              <view
                v-if="
                  !block.field.maxCount ||
                  (form[block.field.key] || []).length < block.field.maxCount
                "
                class="upload-item upload-btn"
                @click="chooseImage(block.field)"
              >
                <image
                  src="@/pagesMy/static/upload.png"
                  mode="aspectFit"
                  class="upload-icon"
                ></image>
              </view>
            </view>
          </template>

          <template v-else-if="block.field.type === 'upload-video'">
            <view class="upload-video-wrapper">
              <view
                v-for="(video, videoIdx) in form[block.field.key] || []"
                :key="videoIdx"
                class="video-preview"
                @click="previewVideo(video)"
              >
                <video
                  :src="video.url"
                  class="video-poster"
                  :show-center-play-btn="false"
                  :enable-play-gesture="false"
                  :controls="false"
                ></video>
                <view class="play-icon-overlay">
                  <view class="play-icon-box">
                    <view class="play-icon"></view>
                  </view>
                </view>
                <view class="delete-btn" @click.stop="removeVideo(block.field, videoIdx)">
                  <text class="delete-icon">×</text>
                </view>
              </view>
              <view class="upload-video-container">
                <view
                  v-if="
                    !block.field.maxCount ||
                    (form[block.field.key] || []).length < block.field.maxCount
                  "
                  class="upload-item upload-btn"
                  @click="chooseVideo(block.field)"
                >
                  <image
                    src="@/pagesMy/static/upload.png"
                    mode="aspectFit"
                    class="upload-icon"
                  ></image>
                </view>
              </view>
            </view>
          </template>

          <template v-else-if="block.field.type === 'radio'">
            <view class="name-gender-row radio-row">
              <!-- <input
                v-model="form[block.field.key]"
                class="input-style"
                :type="block.field.inputType || 'text'"
                :placeholder="block.field.placeholder || '请输入'"
                placeholder-style="color:#999"
              /> -->
              <text v-if="block.field.unit" class="unit">{{ block.field.unit }}</text>
              <view
                class="radio-wrapper"
                @click="
                  form[block.field.radioKey || block.field.key + '_checked'] =
                    !form[block.field.radioKey || block.field.key + '_checked']
                "
              >
                <view
                  class="radio-box"
                  :class="{ checked: form[block.field.radioKey || block.field.key + '_checked'] }"
                >
                  <view
                    v-if="form[block.field.radioKey || block.field.key + '_checked']"
                    class="radio-inner"
                  ></view>
                </view>
                <text class="radio-label">{{ block.field.radioLabel || '待定' }}</text>
              </view>
            </view>
          </template>

          <template v-else-if="block.field.type === 'radio-group'">
            <view class="radio-group-container">
              <view
                v-for="(option, index) in block.field.options || []"
                :key="index"
                class="radio-group-item"
                :class="{ active: form[block.field.key] === option.id }"
                @click="
                  ;(form[block.field.key] = option.id),
                    emit('fieldChange', block.field.key, option.id)
                "
              >
                <view
                  class="radio-group-circle"
                  :class="{ checked: form[block.field.key] === option.id }"
                >
                  <view v-if="form[block.field.key] === option.id" class="radio-group-inner"></view>
                </view>
                <text class="radio-group-label">{{ option.title }}</text>
              </view>
            </view>
          </template>

          <template v-else-if="block.field.type === 'idCard'">
            <view class="idcard-container">
              <view class="idcard-item">
                <view class="idcard-image-wrapper" @click="chooseIdCard(block.field, 'front')">
                  <view class="idcard-image-box">
                    <image
                      v-if="form[block.field.key]?.front"
                      :src="form[block.field.key]?.front"
                      mode="aspectFill"
                      class="idcard-image"
                      @click.stop="previewIdCard(form[block.field.key]?.front)"
                    ></image>
                    <image
                      v-else
                      src="@/pagesMy/static/idcard.png"
                      mode="aspectFill"
                      class="idcard-image"
                    ></image>
                    <view
                      v-if="form[block.field.key]?.front"
                      class="delete-btn"
                      @click.stop="removeIdCard(block.field, 'front')"
                    >
                      <text class="delete-icon">×</text>
                    </view>
                  </view>
                </view>
                <text class="idcard-text">上传身份证人像面</text>
              </view>
              <view class="idcard-item">
                <view class="idcard-image-wrapper" @click="chooseIdCard(block.field, 'back')">
                  <view class="idcard-image-box">
                    <image
                      v-if="form[block.field.key]?.back"
                      :src="form[block.field.key]?.back"
                      mode="aspectFill"
                      class="idcard-image"
                      @click.stop="previewIdCard(form[block.field.key]?.back)"
                    ></image>
                    <image
                      v-else
                      src="@/pagesMy/static/cardback.png"
                      mode="aspectFill"
                      class="idcard-image"
                    ></image>
                    <view
                      v-if="form[block.field.key]?.back"
                      class="delete-btn"
                      @click.stop="removeIdCard(block.field, 'back')"
                    >
                      <text class="delete-icon">×</text>
                    </view>
                  </view>
                </view>
                <text class="idcard-text">上传身份证国徽面</text>
              </view>
            </view>
          </template>
        </view>
      </template>

      <template v-else>
        <view class="form-grid" :style="{ gridTemplateColumns: getGridTemplate(block) }">
          <view
            v-for="(field, fi) in block.fields"
            :key="field.key + '-' + fi"
            class="form-item grid-item"
          >
            <view
              :class="{ 'weight-bold': field.weight === 'bold' }"
              v-if="field.label !== 'none' && field.showLabel !== false"
              class="label"
            >
              {{ field.label }}
              <text v-if="props.showAsteriskForRequired && field.required" style="color: red"
                >*</text
              >
            </view>

            <view v-if="field.desc" class="desc">
              <image src="@/pagesMy/static/alert.png" mode="aspectFill" class="desc-image"></image>
              <text>{{ field.desc.replace(/\/n/g, '\n') }}</text>
            </view>

            <view v-if="field.type === 'line'" class="line"></view>

            <template v-if="(field.type || 'input') === 'input'">
              <view class="name-gender-row">
                <input
                  v-model="form[field.key]"
                  class="input-style"
                  :type="field.inputType || 'text'"
                  :password="field.password === true"
                  :placeholder="field.placeholder || '请输入'"
                  placeholder-style="color:#999"
                  :cursor-spacing="20"
                />
                <text v-if="field.unit" class="unit">{{ field.unit }}</text>
              </view>
            </template>

            <template v-else-if="(field.type || 'code') === 'code'">
              <view class="name-gender-row">
                <input
                  v-model="form[field.key]"
                  class="input-style"
                  :type="field.inputType || 'text'"
                  :password="field.password === true"
                  :placeholder="field.placeholder || '请输入'"
                  placeholder-style="color:#999"
                  :cursor-spacing="20"
                />
                <text @click="sendCode" class="unit" :class="{ 'unit-disabled': isCounting }">
                  {{ isCounting ? `已发送（${countdown}s）` : '发送验证码' }}
                </text>
              </view>
            </template>

            <template v-else-if="field.type === 'textarea'">
              <view class="textarea-wrapper">
                <textarea
                  v-model="form[field.key]"
                  class="textarea"
                  :placeholder="field.placeholder || '请输入'"
                  placeholder-style="color:#999"
                  auto-height
                  :maxlength="500"
                  :cursor-spacing="20"
                />
                <view class="textarea-counter"> {{ (form[field.key] || '').length }}/500 </view>
              </view>
            </template>

            <template v-else-if="field.type === 'select'">
              <view class="name-gender-row" @click="openSelectPopup(field)">
                <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">
                  {{ field.head }}
                </text>
                <text
                  class="input-style"
                  :style="{ color: getSelectedLabel(field) ? '#333' : '#999' }"
                >
                  {{ getSelectedLabel(field) || field.placeholder || '' }}
                </text>
                <text v-if="field.unit" class="unit">{{ field.unit }}</text>
                <image class="arrow-icon" src="/static/house/right.png" mode="aspectFit"></image>
              </view>
            </template>

            <template v-else-if="field.type === 'select-multiple'">
              <view class="name-gender-row" @click="openMultiSelectPopup(field)">
                <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">
                  {{ field.head }}
                </text>
                <text
                  class="input-style"
                  :style="{ color: getMultipleSelectedLabel(field) ? '#333' : '#999' }"
                >
                  {{ getMultipleSelectedLabel(field) || field.placeholder || '' }}
                </text>
                <text v-if="field.unit" class="unit">{{ field.unit }}</text>
                <image class="arrow-icon" src="/static/house/right.png" mode="aspectFit"></image>
              </view>
            </template>

            <template v-else-if="field.type === 'selectSearch'">
              <view class="name-gender-row" @click="openSearchPopup(field)">
                <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">
                  {{ field.head }}
                </text>
                <text
                  class="input-style"
                  :style="{ color: getSearchSelectedLabel(field) ? '#333' : '#999' }"
                >
                  {{ getSearchSelectedLabel(field) || field.placeholder || '' }}
                </text>
                <image class="arrow-icon" src="/static/house/right.png" mode="aspectFit"></image>
              </view>
            </template>

            <template v-else-if="field.type === 'date'">
              <view class="name-gender-row">
                <uni-datetime-picker
                  v-model="form[field.key]"
                  type="date"
                  :clear-icon="false"
                  :placeholder="field.placeholder || '请选择日期'"
                  @change="onDateChange(field, $event)"
                >
                  <template #default>
                    <view class="date-picker-content">
                      <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">
                        {{ field.head }}
                      </text>
                      <text
                        class="input-style"
                        :style="{ color: form[field.key] ? '#333' : '#999' }"
                      >
                        {{ form[field.key] || '请选择日期' }}
                      </text>
                    </view>
                  </template>
                </uni-datetime-picker>
                <image class="date-icon" src="@/pagesMy/static/date.png" mode="aspectFit"></image>
              </view>
            </template>

            <template v-else-if="field.type === 'upload'">
              <view class="upload-container">
                <view
                  v-for="(img, imgIdx) in form[field.key] || []"
                  :key="imgIdx"
                  class="upload-item"
                  @click="previewImage(field, imgIdx)"
                >
                  <image :src="img" mode="aspectFill" class="upload-image"></image>
                  <view class="delete-btn" @click.stop="removeImage(field, imgIdx)">
                    <text class="delete-icon">×</text>
                  </view>
                </view>
                <view
                  v-if="!field.maxCount || (form[field.key] || []).length < field.maxCount"
                  class="upload-item upload-btn"
                  @click="chooseImage(field)"
                >
                  <image
                    src="@/pagesMy/static/upload.png"
                    mode="aspectFit"
                    class="upload-icon"
                  ></image>
                </view>
              </view>
            </template>

            <template v-else-if="field.type === 'upload-video'">
              <view class="upload-video-wrapper">
                <view
                  v-for="(video, videoIdx) in form[field.key] || []"
                  :key="videoIdx"
                  class="video-preview"
                  @click="previewVideo(video)"
                >
                  <video
                    :src="video.url"
                    class="video-poster"
                    :show-center-play-btn="false"
                    :enable-play-gesture="false"
                    :controls="false"
                  ></video>
                  <view class="play-icon-overlay">
                    <view class="play-icon-box">
                      <view class="play-icon"></view>
                    </view>
                  </view>
                  <view class="delete-btn" @click.stop="removeVideo(field, videoIdx)">
                    <text class="delete-icon">×</text>
                  </view>
                </view>
                <view class="upload-video-container">
                  <view
                    v-if="!field.maxCount || (form[field.key] || []).length < field.maxCount"
                    class="upload-item upload-btn"
                    @click="chooseVideo(field)"
                  >
                    <image
                      src="@/pagesMy/static/upload.png"
                      mode="aspectFit"
                      class="upload-icon"
                    ></image>
                  </view>
                </view>
              </view>
            </template>

            <template v-else-if="field.type === 'radio'">
              <view class="name-gender-row radio-row">
                <!-- <input
                  v-model="form[field.key]"
                  class="input-style"
                  :type="field.inputType || 'text'"
                  :placeholder="field.placeholder || '请输入'"
                  placeholder-style="color:#999"
                /> -->
                <text v-if="field.unit" class="unit">{{ field.unit }}</text>
                <view
                  class="radio-wrapper"
                  @click="
                    form[field.radioKey || field.key + '_checked'] =
                      !form[field.radioKey || field.key + '_checked']
                  "
                >
                  <view
                    class="radio-box"
                    :class="{ checked: form[field.radioKey || field.key + '_checked'] }"
                  >
                    <view
                      v-if="form[field.radioKey || field.key + '_checked']"
                      class="radio-inner"
                    ></view>
                  </view>
                  <text class="radio-label">{{ field.radioLabel || '待定' }}</text>
                </view>
              </view>
            </template>

            <template v-else-if="field.type === 'radio-group'">
              <view class="radio-group-container">
                <view
                  v-for="(option, index) in field.options || []"
                  :key="index"
                  class="radio-group-item"
                  :class="{ active: form[field.key] === option.id }"
                  @click=";(form[field.key] = option.id), emit('fieldChange', field.key, option.id)"
                >
                  <view
                    class="radio-group-circle"
                    :class="{ checked: form[field.key] === option.id }"
                  >
                    <view v-if="form[field.key] === option.id" class="radio-group-inner"></view>
                  </view>
                  <text class="radio-group-label">{{ option.title }}</text>
                </view>
              </view>
            </template>

            <template v-else-if="field.type === 'idCard'">
              <view class="idcard-container">
                <view class="idcard-item">
                  <view class="idcard-image-wrapper" @click="chooseIdCard(field, 'front')">
                    <view class="idcard-image-box">
                      <image
                        v-if="form[field.key]?.front"
                        :src="form[field.key]?.front"
                        mode="aspectFill"
                        class="idcard-image"
                        @click.stop="previewIdCard(form[field.key]?.front)"
                      ></image>
                      <image
                        v-else
                        src="@/pagesMy/static/idcard.png"
                        mode="aspectFill"
                        class="idcard-image"
                      ></image>
                      <view
                        v-if="form[field.key]?.front"
                        class="delete-btn"
                        @click.stop="removeIdCard(field, 'front')"
                      >
                        <text class="delete-icon">×</text>
                      </view>
                    </view>
                  </view>
                  <text class="idcard-text">上传身份证人像面</text>
                </view>
                <view class="idcard-item">
                  <view class="idcard-image-wrapper" @click="chooseIdCard(field, 'back')">
                    <view class="idcard-image-box">
                      <image
                        v-if="form[field.key]?.back"
                        :src="form[field.key]?.back"
                        mode="aspectFill"
                        class="idcard-image"
                        @click.stop="previewIdCard(form[field.key]?.back)"
                      ></image>
                      <image
                        v-else
                        src="@/pagesMy/static/cardback.png"
                        mode="aspectFill"
                        class="idcard-image"
                      ></image>
                      <view
                        v-if="form[field.key]?.back"
                        class="delete-btn"
                        @click.stop="removeIdCard(field, 'back')"
                      >
                        <text class="delete-icon">×</text>
                      </view>
                    </view>
                  </view>
                  <text class="idcard-text">上传身份证国徽面</text>
                </view>
              </view>
            </template>
          </view>
        </view>
      </template>
    </template>
    <!-- uni-popup 选择弹窗 -->
    <uni-popup ref="popupRef" safe-area type="bottom" background-color="#fff">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">{{ currentField?.placeholder || '请选择' }}</text>
        </view>
        <scroll-view scroll-y class="popup-content">
          <view class="options-grid">
            <view
              v-for="(option, index) in currentField?.options || []"
              :key="index"
              class="option-item"
              :class="{ active: tempSelectedValue === option.id }"
              @click="selectOption(option)"
            >
              <text class="option-text">{{ option.title }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="popup-footer">
          <view class="footer-btn cancel" @click="closePopup">
            <text class="btn-text">关闭</text>
          </view>
          <view class="footer-btn confirm" @click="confirmSelect">
            <text class="btn-text">确认</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- uni-popup 多选弹窗 -->
    <uni-popup ref="multiPopupRef" safe-area type="bottom" background-color="#fff">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">{{ currentMultiField?.placeholder || '请选择' }}</text>
        </view>
        <scroll-view scroll-y class="popup-content">
          <view class="options-grid">
            <view
              v-for="(option, index) in currentMultiField?.options || []"
              :key="index"
              class="option-item"
              :class="{ active: tempSelectedValues.includes(option.id) }"
              @click="toggleMultiOption(option)"
            >
              <text class="option-text">{{ option.title }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="popup-footer">
          <view class="footer-btn cancel" @click="closeMultiPopup">
            <text class="btn-text">关闭</text>
          </view>
          <view class="footer-btn confirm" @click="confirmMultiSelect">
            <text class="btn-text">确认</text>
          </view>
        </view>
      </view>
    </uni-popup>

    <!-- uni-popup 搜索选择弹窗 -->
    <uni-popup ref="searchPopupRef" type="bottom" background-color="#fff">
      <view class="search-popup-container" :style="{ paddingTop: safeAreaInsets!.top + 10 + 'px' }">
        <!-- <view class="search-popup-header">
          <text class="search-popup-title">{{
            currentSearchField?.placeholder || '请选择' + currentSearchField?.label
          }}</text>
        </view> -->
        <view class="search-popup-content">
          <ShSearchBox
            v-model="searchKeyword"
            :placeholder="currentSearchField?.placeholder || '搜索'"
            @search="handleSearchKeyword"
          />
          <ShInvestorList
            :list="searchList"
            :loading="searchLoading"
            :hasMore="searchHasMore"
            :selectedId="selectedSearchId"
            @loadMore="handleLoadMoreSearch"
            @select="handleSelectSearchItem"
          />
        </view>
        <view class="search-popup-footer">
          <view class="footer-btn cancel" @click="closeSearchPopup">
            <text class="btn-text">取消</text>
          </view>
          <view class="footer-btn confirm" @click="confirmSearchSelect">
            <text class="btn-text">保存</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
@import './styles/ShCustomForm.scss';
</style>
