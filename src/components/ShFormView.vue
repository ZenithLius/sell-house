<script setup lang="ts">
import { computed } from 'vue'
import type { CustomFormField as FieldConfig } from '@/types/customFormField'

const props = withDefaults(
  defineProps<{
    modelValue: Record<string, any>
    fields: FieldConfig[]
    showAsteriskForRequired?: boolean
  }>(),
  {
    showAsteriskForRequired: true,
  },
)

// 只读表单数据
const form = computed(() => props.modelValue || {})

const fieldVisible = (field: FieldConfig) => {
  const v: any = field.visible
  if (typeof v === 'function') return v(form.value)
  if (typeof v === 'boolean') return v
  return true
}

// 过滤可展示字段
const renderFields = computed(() => props.fields.filter((f) => fieldVisible(f)))

const renderBlocks = computed(() => {
  const blocks: Array<{ cols: number; fields: FieldConfig[] }> = []
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
      if (current.length) blocks.push({ cols: current.length, fields: current })
      current = [f]
      used = w
    } else {
      current.push(f)
      used += w
    }

    if (used === 24) {
      blocks.push({ cols: current.length, fields: current })
      current = []
      used = 0
    }
  }

  if (current.length) {
    blocks.push({ cols: current.length, fields: current })
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

const getSelectedLabel = (field: FieldConfig) => {
  const val = (form.value as any)[field.key]
  const opt = field.options?.find((o) => o.id === val)
  return opt?.title ?? ''
}

// 图片预览（upload、idCard）
const previewImage = (urls: string[] | string, index = 0) => {
  const list = Array.isArray(urls) ? urls : [urls]
  if (!list.length) return
  // 过滤掉占位图
  const filtered = list.filter((u) => !!u && !u.includes('/static/'))
  if (!filtered.length) return
  uni.previewImage({ current: index, urls: filtered })
}

const previewIdCard = (imagePath: string) => {
  if (!imagePath || imagePath.includes('/static/')) return
  uni.previewImage({ current: 0, urls: [imagePath] })
}
</script>

<template>
  <view class="form">
    <template v-for="(block, bi) in renderBlocks" :key="bi">
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
            <text v-if="props.showAsteriskForRequired && field.required" style="color: red">*</text>
          </view>

          <view v-if="field.desc" class="desc">
            <image src="@/pagesMy/static/alert.png" mode="aspectFill" class="desc-image"></image>
            <text>{{ field.desc.replace(/\/n/g, '\n') }}</text>
          </view>

          <view v-if="field.type === 'line'" class="line"></view>

          <!-- 文本输入展示 -->
          <template v-if="(field.type || 'input') === 'input'">
            <view class="name-gender-row">
              <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">{{
                field.head
              }}</text>
              <text
                class="input-style"
                :style="{ color: (form as any)[field.key] ? '#333' : '#999' }"
              >
                {{ (form as any)[field.key] || field.placeholder || '' }}
              </text>
              <text v-if="field.unit" class="unit">{{ field.unit }}</text>
            </view>
          </template>

          <!-- 验证码输入（code）展示，按普通输入样式显示文本 -->
          <template v-else-if="(field.type || 'code') === 'code'">
            <view class="name-gender-row">
              <text
                class="input-style"
                :style="{ color: (form as any)[field.key] ? '#333' : '#999' }"
              >
                {{ (form as any)[field.key] || field.placeholder || '' }}
              </text>
              <text v-if="field.unit" class="unit">{{ field.unit }}</text>
            </view>
          </template>

          <!-- 多行文本展示 -->
          <template v-else-if="field.type === 'textarea'">
            <view class="textarea-wrapper">
              <view class="textarea">
                <text>{{ (form as any)[field.key] || field.placeholder || '' }}</text>
              </view>
            </view>
          </template>

          <!-- 下拉选择展示（含 selectSearch） -->
          <template v-else-if="field.type === 'select' || field.type === 'selectSearch'">
            <view class="name-gender-row">
              <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">{{
                field.head
              }}</text>
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

          <!-- 日期展示 -->
          <template v-else-if="field.type === 'date'">
            <view class="name-gender-row">
              <view class="date-picker-content">
                <text v-if="field.head" class="input-styles" :style="{ color: '#333' }">{{
                  field.head
                }}</text>
                <text
                  class="input-style"
                  :style="{ color: (form as any)[field.key] ? '#333' : '#999' }"
                >
                  {{ (form as any)[field.key] || '请选择日期' }}
                </text>
              </view>
              <image class="date-icon" src="@/pagesMy/static/date.png" mode="aspectFit"></image>
            </view>
          </template>

          <!-- 单选开关（radio）展示 -->
          <template v-else-if="field.type === 'radio'">
            <view class="name-gender-row radio-row">
              <text v-if="field.unit" class="unit">{{ field.unit }}</text>
              <view class="radio-wrapper">
                <view
                  class="radio-box"
                  :class="{ checked: (form as any)[field.radioKey || field.key + '_checked'] }"
                >
                  <view
                    v-if="(form as any)[field.radioKey || field.key + '_checked']"
                    class="radio-inner"
                  ></view>
                </view>
                <text class="radio-label">{{ field.radioLabel || '待定' }}</text>
              </view>
            </view>
          </template>

          <!-- 单选组（radio-group）展示 -->
          <template v-else-if="field.type === 'radio-group'">
            <view class="radio-group-container">
              <view
                v-for="(option, index) in field.options || []"
                :key="index"
                class="radio-group-item"
                :class="{ active: (form as any)[field.key] === option.id }"
              >
                <view
                  class="radio-group-circle"
                  :class="{ checked: (form as any)[field.key] === option.id }"
                >
                  <view
                    v-if="(form as any)[field.key] === option.id"
                    class="radio-group-inner"
                  ></view>
                </view>
                <text class="radio-group-label">{{ option.title }}</text>
              </view>
            </view>
          </template>

          <!-- 图片上传（upload）展示 -->
          <template v-else-if="field.type === 'upload'">
            <view class="upload-container">
              <view
                v-for="(img, imgIdx) in (form as any)[field.key] || []"
                :key="imgIdx"
                class="upload-item"
                @click="previewImage((form as any)[field.key], imgIdx)"
              >
                <image :src="img" mode="aspectFill" class="upload-image"></image>
              </view>
            </view>
          </template>

          <!-- 身份证（idCard）展示 -->
          <template v-else-if="field.type === 'idCard'">
            <view class="idcard-container">
              <view class="idcard-item">
                <view class="idcard-image-wrapper">
                  <view class="idcard-image-box">
                    <image
                      v-if="(form as any)[field.key]?.front"
                      :src="(form as any)[field.key]?.front"
                      mode="aspectFill"
                      class="idcard-image"
                      @click.stop="previewIdCard((form as any)[field.key]?.front)"
                    />
                    <image
                      v-else
                      src="@/pagesMy/static/idcard.png"
                      mode="aspectFill"
                      class="idcard-image"
                    />
                  </view>
                </view>
                <text class="idcard-text">上传身份证人像面</text>
              </view>
              <view class="idcard-item">
                <view class="idcard-image-wrapper">
                  <view class="idcard-image-box">
                    <image
                      v-if="(form as any)[field.key]?.back"
                      :src="(form as any)[field.key]?.back"
                      mode="aspectFill"
                      class="idcard-image"
                      @click.stop="previewIdCard((form as any)[field.key]?.back)"
                    />
                    <image
                      v-else
                      src="@/pagesMy/static/cardback.png"
                      mode="aspectFill"
                      class="idcard-image"
                    />
                  </view>
                </view>
                <text class="idcard-text">上传身份证国徽面</text>
              </view>
            </view>
          </template>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.form {
  padding: 24rpx 32rpx;
}
.line {
  height: 10rpx;
  background: #f7f8fc;
  margin-top: 53rpx;
  width: 100vw;
  margin-left: -32rpx;
}
.desc {
  height: 88rpx;
  background: #f5ecff;
  border-radius: 18rpx;
  display: flex;
  padding: 18rpx;
  margin-bottom: 24rpx;
  height: auto;
  column-gap: 13rpx;
  text {
    font-family: Source Han Sans CN;
    font-weight: 400;
    font-size: 24rpx;
    color: #863fce;
    line-height: 30rpx;
    white-space: pre-line;
  }
}

.desc-image {
  width: 24rpx;
  height: 24rpx;
  margin-top: 5rpx;
}

.weight-bold {
  font-family: Source Han Sans CN;
  font-weight: bold !important;
  font-size: 34rpx !important;
  color: #181818 !important;
  line-height: 38rpx !important;
  margin-top: 53rpx !important;
}

.form-grid {
  display: grid;
}

.form-grid .form-item {
  margin-bottom: 0;
  padding-right: 15rpx;
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
    margin-bottom: 28rpx;

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
    padding-bottom: 24rpx;
    font-size: 28rpx;
    color: #333;
    min-height: 200rpx;
    max-height: 300rpx;
    box-sizing: border-box;
  }

  .upload-container {
    padding: 34rpx;
    display: flex;
    flex-wrap: wrap;
    background-color: #f7f7f7;
    border-radius: 18rpx;
    gap: 24rpx;
    margin-bottom: 30rpx;
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
  }

  .idcard-text {
    font-size: 26rpx;
    color: #666;
    text-align: center;
  }

  .radio-row {
    position: relative;
    background-color: white;
  }

  .radio-wrapper {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-left: 20rpx;
    flex-shrink: 0;
  }

  .radio-box {
    width: 32rpx;
    height: 32rpx;
    border: 2rpx solid #d9d9d9;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    &.checked {
      border-color: #863fce;
    }
  }

  .radio-inner {
    width: 18rpx;
    height: 18rpx;
    border-radius: 50%;
    background-color: #863fce;
  }

  .radio-label {
    font-size: 28rpx;
    color: #333;
    white-space: nowrap;
  }

  // radio-group 样式
  .radio-group-container {
    display: flex;
    gap: 32rpx;
    padding: 24rpx 0;
  }

  .radio-group-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    transition: all 0.3s;
  }

  .radio-group-circle {
    width: 26rpx;
    height: 26rpx;
    border: 2rpx solid #d5d5d5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;

    &.checked {
      border-color: #863fce;
    }
  }

  .radio-group-inner {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
    background-color: #863fce;
  }

  .radio-group-label {
    font-family: Source Han Sans CN;
    font-weight: 500;
    font-size: 28rpx;
    color: #494949;
    line-height: 42rpx;
  }

  .radio-group-item.active {
    .radio-group-label {
      color: #863fce;
    }
  }
}
</style>
