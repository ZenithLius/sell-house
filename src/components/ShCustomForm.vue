<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import SearchBox from '@/pagesMy/authentication/components/SearchBox.vue'
import InvestorList from '@/pagesMy/authentication/components/InvestorList.vue'
const { safeAreaInsets } = uni.getSystemInfoSync()
interface OptionItem {
  label: string
  value: any
  phone?: string
}

interface FieldConfig {
  head?: string
  key: string
  label: string
  type?: 'input' | 'textarea' | 'select' | 'date' | 'upload' | 'idCard' | 'selectSearch'
  placeholder?: string
  inputType?: 'text' | 'number' | 'idcard' | 'digit'
  password?: boolean
  unit?: string
  required?: boolean
  options?: OptionItem[]
  maxCount?: number
  visible?: boolean | ((form: Record<string, any>) => boolean)
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
}>()

const form = ref<Record<string, any>>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (v) => {
    form.value = { ...v }
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
  const opt = field.options?.find((o) => o.value === val)
  return opt?.label ?? ''
}

const fieldVisible = (field: FieldConfig) => {
  const v: any = field.visible
  if (typeof v === 'function') return v(form.value)
  if (typeof v === 'boolean') return v
  return true
}

// 根据 visible 过滤可展示的字段，避免在模板中 v-for 与 v-if 混用
const renderFields = computed(() => props.fields.filter((f) => fieldVisible(f)))

const onSelectChange = (field: FieldConfig, e: any) => {
  const index = e?.detail?.value ?? 0
  const opt = field.options?.[index]
  const val = opt ? opt.value : undefined
  form.value[field.key] = val
  emit('fieldChange', field.key, val)
}

const validate = () => {
  const errors: { key: string; label: string; message: string }[] = []
  props.fields.forEach((f) => {
    if (f.required) {
      const v = form.value[f.key]
      let empty = false

      if (f.type === 'idCard') {
        // 身份证需要检查 front 和 back 是否都有值
        empty = !v || !v.front || !v.back
      } else if (f.type === 'upload') {
        // 图片上传需要检查数组是否为空
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
    success: (res) => {
      const tempFilePaths = res.tempFilePaths
      const newImages = [...currentImages, ...tempFilePaths]
      form.value[field.key] = newImages
      emit('fieldChange', field.key, newImages)
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

// uni-popup 相关
const popupRef = ref<any>(null)
const currentField = ref<FieldConfig | null>(null)
const tempSelectedValue = ref<any>(null)

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
  tempSelectedValue.value = option.value
}

// selectSearch 相关方法
const openSearchPopup = (field: FieldConfig) => {
  currentSearchField.value = field
  selectedSearchId.value = form.value[field.key]
  // 初始化搜索列表
  searchKeyword.value = ''
  searchList.value =
    field.options?.map((opt, idx) => ({
      id: opt.value,
      name: opt.label,
      phone: opt.phone,
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
  console.log('搜索关键词:', keyword)
  // 这里可以添加搜索过滤逻辑
  if (currentSearchField.value?.options) {
    const filtered = currentSearchField.value.options.filter((opt) =>
      opt.label.toLowerCase().includes(keyword.toLowerCase()),
    )
    searchList.value = filtered.map((opt) => ({
      id: opt.value,
      name: opt.label,
      phone: '',
    }))
  }
}

const handleLoadMoreSearch = () => {
  // 如果需要分页加载,可以在这里实现
  console.log('加载更多')
}

const handleSelectSearchItem = (id: string | number) => {
  selectedSearchId.value = id
}

const getSearchSelectedLabel = (field: FieldConfig) => {
  const val = form.value[field.key]
  const opt = field.options?.find((o) => o.value === val)
  return opt?.label ?? ''
}

// 发送验证码倒计时
const countdown = ref(0)
const isCounting = ref(false)
let timer: any = null

const sendCode = () => {
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
    <view v-for="field in renderFields" :key="field.key" class="form-item">
      <view class="label">
        {{ field.label }}
        <text v-if="props.showAsteriskForRequired && field.required" style="color: red">*</text>
      </view>

      <template v-if="(field.type || 'input') === 'input'">
        <view class="name-gender-row">
          <input
            v-model="form[field.key]"
            class="input-style"
            :type="field.inputType || 'text'"
            :password="field.password === true"
            :placeholder="field.placeholder || '请输入'"
            placeholder-style="color:#999"
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
          />
          <view class="textarea-counter"> {{ (form[field.key] || '').length }}/500 </view>
        </view>
      </template>

      <template v-else-if="field.type === 'select'">
        <view class="name-gender-row" @click="openSelectPopup(field)">
          <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">
            {{ field.head }}
          </text>
          <text class="input-style" :style="{ color: getSelectedLabel(field) ? '#333' : '#999' }">
            {{ getSelectedLabel(field) || field.placeholder || '' }}
          </text>
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
                <text class="input-style" :style="{ color: form[field.key] ? '#333' : '#999' }">
                  {{ form[field.key] || '请选择日期' }}
                </text>
              </view>
            </template>
          </uni-datetime-picker>
          <image class="date-icon" src="/static/my/date.png" mode="aspectFit"></image>
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
            <image src="/static/my/upload.png" mode="aspectFit" class="upload-icon"></image>
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
                  :src="'/static/my/idcard.png'"
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
                  :src="'/static/my/idcard.png'"
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
    <!-- uni-popup 选择弹窗 -->
    <uni-popup ref="popupRef" type="bottom" background-color="#fff">
      <view class="popup-container">
        <view class="popup-header">
          <text class="popup-title">{{
            currentField?.placeholder || '请选择' + currentField?.label
          }}</text>
        </view>
        <scroll-view scroll-y class="popup-content">
          <view class="options-grid">
            <view
              v-for="(option, index) in currentField?.options || []"
              :key="index"
              class="option-item"
              :class="{ active: tempSelectedValue === option.value }"
              @click="selectOption(option)"
            >
              <text class="option-text">{{ option.label }}</text>
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

    <!-- uni-popup 搜索选择弹窗 -->
    <uni-popup ref="searchPopupRef" type="bottom" background-color="#fff">
      <view class="search-popup-container" :style="{ paddingTop: safeAreaInsets!.top +10 + 'px' }">
        <!-- <view class="search-popup-header">
          <text class="search-popup-title">{{
            currentSearchField?.placeholder || '请选择' + currentSearchField?.label
          }}</text>
        </view> -->
        <view class="search-popup-content">
          <SearchBox
            v-model="searchKeyword"
            :placeholder="currentSearchField?.placeholder || '搜索'"
            @search="handleSearchKeyword"
          />
          <InvestorList
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
.form {
  padding: 24rpx 32rpx;
}

.form-item {
  margin-bottom: 32rpx;

  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 20rpx;
    font-weight: 500;
  }

  .name-gender-row {
    display: flex;
    align-items: center;
    background-color: #f7f7f7;
    border-radius: 12rpx;
    height: 88rpx;
    padding-left: 28rpx;
    padding-right: 28rpx;

    .input-style {
      flex: 1;
      height: 100%;
      background: transparent;
      border: none;
      font-size: 28rpx;
      color: #333;
      display: flex;
      align-items: center;
    }
  }

  .unit {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 28rpx;
    color: #863fce;
    margin-left: 16rpx;
    flex-shrink: 0;
    transition: all 0.3s;

    &.unit-disabled {
      color: rgba(134, 63, 206, 0.4);
      cursor: not-allowed;
    }
  }

  .arrow-icon {
    width: 10rpx;
    height: 19rpx;
    margin-left: 16rpx;
    flex-shrink: 0;
  }

  .date-icon {
    width: 32rpx;
    height: 32rpx;
    margin-left: 16rpx;
    flex-shrink: 0;
  }

  .date-picker-content {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .textarea-wrapper {
    position: relative;
    width: 100%;
    background-color: #f7f7f7;
    border-radius: 12rpx;
  }

  .textarea {
    width: 100%;
    background-color: transparent;
    padding: 24rpx;
    padding-bottom: 60rpx;
    font-size: 28rpx;
    color: #333;
    min-height: 200rpx;
    max-height: 300rpx;
    box-sizing: border-box;
  }

  .textarea-counter {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    font-size: 24rpx;
    color: #999;
  }

  .upload-container {
    padding: 34rpx;
    display: flex;
    flex-wrap: wrap;
    background-color: #f7f7f7;
    border-radius: 18rpx;
    gap: 24rpx;
  }

  .upload-item {
    width: 30%;
    height: 168rpx;
    border-radius: 12rpx;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
  }

  .upload-image {
    width: 100%;
    height: 100%;
  }

  .delete-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 40rpx;
    height: 40rpx;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0 12rpx 0 12rpx;
  }

  .delete-icon {
    color: #fff;
    font-size: 32rpx;
    line-height: 32rpx;
    font-weight: bold;
  }

  .upload-btn {
    // background: #863fce;
    width: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .upload-icon {
    width: 100%;
    height: 230rpx;
  }

  .idcard-container {
    display: flex;
    gap: 24rpx;
    justify-content: space-between;
    background-color: #f7f7f7;
    border-radius: 18rpx;
    padding: 34rpx;
  }

  .idcard-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
  }

  .idcard-image-wrapper {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .idcard-image-box {
    position: relative;
    width: 230rpx;
    height: 142rpx;
  }

  .idcard-image {
    width: 100%;
    height: 100%;
    border-radius: 12rpx;
    border: 2rpx dashed #d9d9d9;
    background-color: #fafafa;
  }

  .idcard-text {
    font-size: 26rpx;
    color: #666;
    text-align: center;
  }
}

.popup-container {
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  // padding-bottom: env(safe-area-inset-bottom);
}

.popup-header {
  padding: 40rpx 32rpx 32rpx;
  text-align: center;
  border-bottom: 1rpx solid #f0f0f0;

  .popup-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}

.popup-content {
  max-height: 800rpx;
  padding: 32rpx;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
}

.option-item {
  background: #f7f7f7;
  border-radius: 12rpx;
  height: 62rpx;
  padding: 20rpx 28rpx;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 26rpx;
  color: #202020;

  &.active {
    background: #f0e1ff;
    color: #6c27b3;

    .option-text {
      color: #6c27b3;
    }
  }

  .option-text {
    font-size: 28rpx;
    color: #333;
    white-space: nowrap;
  }
}

.popup-footer {
  display: flex;
  padding: 32rpx 32rpx 0rpx 32rpx;
  gap: 24rpx;
  border-top: 1rpx solid #f0f0f0;
}

.search-popup-container {
  background: #fff;
  border-radius: 32rpx 32rpx 0 0;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  padding-top: env(safe-area-inset-top);
}

.search-popup-header {
  padding: 40rpx 32rpx 32rpx;
  text-align: center;
  border-bottom: 1rpx solid #f0f0f0;
  flex-shrink: 0;

  .search-popup-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
  }
}

.search-popup-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.search-popup-footer {
  display: flex;
  padding: 32rpx 32rpx 0rpx 32rpx;
  gap: 24rpx;
  border-top: 1rpx solid #f0f0f0;
  flex-shrink: 0;
}

.footer-btn {
  flex: 1;
  height: 76rpx;
  border-radius: 10rpx;
  width: 248rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.cancel {
    background: #ffffff;
    border: 2px solid #eaeaea;

    .btn-text {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #202020;
    }
  }

  &.confirm {
    background: #863fce;
    border-radius: 10rpx;

    .btn-text {
      font-family: Source Han Sans CN;
      font-weight: 400;
      font-size: 28rpx;
      color: #ffffff;
    }
  }

  .btn-text {
    font-size: 32rpx;
    font-weight: 500;
  }
}
</style>
