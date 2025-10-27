<template>
  <!-- 名片海报弹窗 -->
  <view class="card-poster-container" v-if="showCardPoster">
    <!-- 遮罩层 -->
    <view class="card-mask" @click="closePoster"></view>

    <!-- 海报内容 -->
    <view class="card-poster-wrapper">
      <view class="card-poster-content">
        <!-- Canvas 画布 -->
        <canvas
          canvas-id="cardCanvas"
          :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
          class="card-poster-canvas"
        ></canvas>

        <!-- 调试信息（生成中显示） -->
        <view v-if="!posterImage" class="card-debug-info">
          <text>{{ debugMsg }}</text>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="card-btn-group">
        <button class="card-save-btn" @click="savePoster">保存相册</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'

// 定义用户信息类型
interface UserInfo {
  avatar: string
  name: string
  role: string
  phone: string
  company: string
  qrcode: string
}

const showCardPoster = ref(false) // 是否显示名片弹窗
const posterImage = ref('') // 生成的名片图片路径
const debugMsg = ref('初始化中...') // 调试信息

// 用户信息
const userInfo = ref<UserInfo>({
  avatar: '',
  name: '',
  role: '',
  phone: '',
  company: '',
  qrcode: '',
})

// 获取系统信息
const sys = uni.getSystemInfoSync()
// ===== 名片画布尺寸控制（可修改） =====
const CARD_WIDTH_RATIO = 0.85 // 名片宽度占屏幕宽度的比例（0.85 = 85%）【修改此值可改变名片整体宽度】
const canvasWidth = Math.floor(sys.windowWidth * CARD_WIDTH_RATIO)
const rpx = canvasWidth / 750
// 名片整体高度（rpx）【修改此值可改变名片整体高度，让画布和卡片更贴合】
const CARD_HEIGHT_RPX = 1000
const canvasHeight = Math.floor(CARD_HEIGHT_RPX * rpx)

// 获取组件实例
const instance = getCurrentInstance()
const self = instance?.proxy as any

// 打开名片海报（对外暴露）
const openPoster = (data: UserInfo) => {
  userInfo.value = data
  showCardPoster.value = true
  posterImage.value = ''
  debugMsg.value = '准备生成名片...'

  // 延迟执行，确保Canvas已渲染
  setTimeout(() => {
    generateCardPoster()
  }, 100)
}

// 关闭名片弹窗
const closePoster = () => {
  showCardPoster.value = false
  posterImage.value = ''
}

// 下载网络图片到本地（小程序 canvas 不支持直接绘制网络图片）
const downloadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 如果是本地路径，直接返回
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      resolve(url)
      return
    }

    // 下载网络图片
    uni.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error(`下载图片失败: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// 绘制圆形图片
const drawCircleImage = (ctx: any, imagePath: string, x: number, y: number, radius: number) => {
  ctx.save()
  ctx.beginPath()
  ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI)
  ctx.clip()
  ctx.drawImage(imagePath, x, y, radius * 2, radius * 2)
  ctx.restore()
}

// 绘制圆角矩形
const drawRoundRect = (ctx: any, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arc(x + w - r, y + r, r, 1.5 * Math.PI, 2 * Math.PI)
  ctx.lineTo(x + w, y + h - r)
  ctx.arc(x + w - r, y + h - r, r, 0, 0.5 * Math.PI)
  ctx.lineTo(x + r, y + h)
  ctx.arc(x + r, y + h - r, r, 0.5 * Math.PI, Math.PI)
  ctx.lineTo(x, y + r)
  ctx.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI)
  ctx.closePath()
}

// 生成名片海报
const generateCardPoster = async () => {
  try {
    debugMsg.value = '开始绘制名片...'
    console.log('===== 开始生成名片 =====')

    // 1. 下载网络图片到本地（如果是网络图片）
    debugMsg.value = '下载图片资源...'
    console.log('1. 下载图片资源')
    const [localAvatar, localQrcode] = await Promise.all([
      downloadImage(userInfo.value.avatar),
      downloadImage(userInfo.value.qrcode),
    ])
    console.log('图片下载完成:', { localAvatar, localQrcode })

    const ctx = uni.createCanvasContext('cardCanvas', self)
    ctx.setTextBaseline('top')

    // ===== 样式参数配置区域（集中管理所有可修改的样式）=====

    // — 整体布局参数
    const PADDING_X_RPX = 40 // 左右内边距【修改此值调整名片左右边距】
    const PADDING_TOP_RPX = 60 // 顶部内边距【修改此值调整名片顶部边距】

    // — 卡片区域参数
    const CARD_MARGIN_TOP_RPX = 100 // 卡片距离顶部的距离【修改此值改变卡片整体位置】
    const CARD_WIDTH_RPX = 670 // 卡片宽度【修改此值改变卡片宽度】
    const CARD_HEIGHT_RPX = 900 // 卡片高度【修改此值改变卡片高度】
    const CARD_RADIUS_RPX = 30 // 卡片圆角【修改此值改变卡片圆角大小】
    const CARD_BG_COLOR = '#C8B3E8' // 卡片背景色【修改此值改变卡片背景颜色】

    // — 大头像参数（横切卡片顶部）
    const MAIN_AVATAR_SIZE_RPX = 200 // 大头像尺寸【修改此值改变头像大小】
    const MAIN_AVATAR_Y_OFFSET_RPX = -80 // 头像向上偏移量，负值表示向上超出卡片【修改此值改变头像横切程度】
    const AVATAR_BORDER_WIDTH_PX = 6 // 头像边框宽度【修改此值改变头像边框粗细】
    const AVATAR_BORDER_COLOR = '#FFFFFF' // 头像边框颜色【修改此值改变头像边框颜色】

    // — 姓名信息参数
    const NAME_FONT_RPX = 48 // 姓名字号【修改此值改变姓名文字大小】
    const NAME_Y_OFFSET_RPX = 30 // 姓名距离头像的距离【修改此值改变姓名与头像间距】
    const NAME_COLOR = '#000000' // 姓名颜色【修改此值改变姓名文字颜色】

    // — 电话号码参数
    const PHONE_FONT_RPX = 40 // 电话号码字号【修改此值改变电话文字大小】
    const PHONE_Y_OFFSET_RPX = 20 // 电话距离姓名的距离【修改此值改变电话与姓名间距】
    const PHONE_COLOR = '#333333' // 电话颜色【修改此值改变电话文字颜色】

    // — 公司名称参数
    const COMPANY_FONT_RPX = 28 // 公司名称字号【修改此值改变公司名称文字大小】
    const COMPANY_Y_OFFSET_RPX = 15 // 公司名称距离电话的距离【修改此值改变公司名称与电话间距】
    const COMPANY_COLOR = '#666666' // 公司名称颜色【修改此值改变公司名称文字颜色】

    // — 二维码参数
    const QR_SIZE_RPX = 350 // 二维码尺寸【修改此值改变二维码大小】
    const QR_Y_OFFSET_RPX = 35 // 二维码距离公司名称的距离【修改此值改变二维码位置】
    const QR_BG_COLOR = '#FFFFFF' // 二维码背景色【修改此值改变二维码背景颜色】
    const QR_PADDING_RPX = 15 // 二维码内边距【修改此值改变二维码内边距】

    // — 底部提示文字参数
    const TIP_TEXT = '扫码关注看更多好房' // 提示文字内容【修改此值改变提示文字内容】
    const TIP_FONT_RPX = 24 // 提示文字字号【修改此值改变提示文字大小】
    const TIP_Y_OFFSET_RPX = 50 // 提示文字距离二维码的距离【修改此值改变提示文字位置】
    const TIP_COLOR = '#999999' // 提示文字颜色【修改此值改变提示文字颜色】

    // ===== 将 rpx 转换为 px =====
    const paddingX = Math.round(PADDING_X_RPX * rpx)
    const paddingTop = Math.round(PADDING_TOP_RPX * rpx)

    // 1. 绘制卡片背景（使用渐变色）
    console.log('1. 绘制卡片背景')
    debugMsg.value = '绘制卡片背景...'
    const cardMarginTop = Math.round(CARD_MARGIN_TOP_RPX * rpx)
    const cardWidth = Math.round(CARD_WIDTH_RPX * rpx)
    const cardHeight = Math.round(CARD_HEIGHT_RPX * rpx)
    const cardX = (canvasWidth - cardWidth) / 2
    const cardY = cardMarginTop
    const cardRadius = Math.round(CARD_RADIUS_RPX * rpx)

    // 创建渐变色（从上到下）
    const cardGradient = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardHeight)
    cardGradient.addColorStop(0, '#BF91ED') // F7F7F7 顶部颜色
    cardGradient.addColorStop(1, '#F7F7F7') // BF91ED 底部颜色

    ctx.setFillStyle(cardGradient)
    drawRoundRect(ctx, cardX, cardY, cardWidth, cardHeight, cardRadius)
    ctx.fill()

    // 3. 绘制中间大头像（带白色边框，横切卡片顶部）
    console.log('3. 绘制中间大头像')
    debugMsg.value = '绘制中间头像...'
    const mainAvatarSize = Math.round(MAIN_AVATAR_SIZE_RPX * rpx)
    const mainAvatarX = (canvasWidth - mainAvatarSize) / 2
    // 头像Y坐标 = 卡片顶部 + 向上偏移量（负值会让头像向上超出卡片）
    const mainAvatarY = cardY + Math.round(MAIN_AVATAR_Y_OFFSET_RPX * rpx)

    // 绘制白色圆形边框
    ctx.setFillStyle(AVATAR_BORDER_COLOR)
    ctx.beginPath()
    ctx.arc(
      mainAvatarX + mainAvatarSize / 2,
      mainAvatarY + mainAvatarSize / 2,
      mainAvatarSize / 2 + AVATAR_BORDER_WIDTH_PX,
      0,
      2 * Math.PI,
    )
    ctx.fill()

    // 绘制头像（使用下载后的本地路径）
    drawCircleImage(ctx, localAvatar, mainAvatarX, mainAvatarY, mainAvatarSize / 2)

    // 4. 绘制姓名
    console.log('4. 绘制姓名')
    debugMsg.value = '绘制姓名...'
    const nameY = mainAvatarY + mainAvatarSize + Math.round(NAME_Y_OFFSET_RPX * rpx)
    ctx.setFillStyle(NAME_COLOR)
    ctx.setFontSize(Math.round(NAME_FONT_RPX * rpx))
    ctx.setTextAlign('center')
    ctx.fillText(userInfo.value.name, canvasWidth / 2, nameY)

    // 5. 绘制电话号码
    console.log('5. 绘制电话号码')
    debugMsg.value = '绘制电话...'
    const phoneY = nameY + Math.round(PHONE_Y_OFFSET_RPX * rpx) + Math.round(NAME_FONT_RPX * rpx)
    ctx.setFillStyle(PHONE_COLOR)
    ctx.setFontSize(Math.round(PHONE_FONT_RPX * rpx))
    ctx.fillText(userInfo.value.phone, canvasWidth / 2, phoneY)

    // 6. 绘制公司名称
    console.log('6. 绘制公司名称')
    debugMsg.value = '绘制公司名称...'
    const companyY =
      phoneY + Math.round(COMPANY_Y_OFFSET_RPX * rpx) + Math.round(PHONE_FONT_RPX * rpx)
    ctx.setFillStyle(COMPANY_COLOR)
    ctx.setFontSize(Math.round(COMPANY_FONT_RPX * rpx))
    ctx.fillText(userInfo.value.company, canvasWidth / 2, companyY)

    // 7. 绘制二维码背景
    console.log('7. 绘制二维码')
    debugMsg.value = '绘制二维码...'
    const qrSize = Math.round(QR_SIZE_RPX * rpx)
    const qrPadding = Math.round(QR_PADDING_RPX * rpx)
    const qrBgSize = qrSize + qrPadding * 2
    const qrBgX = (canvasWidth - qrBgSize) / 2
    const qrBgY = companyY + Math.round(COMPANY_FONT_RPX * rpx) + Math.round(QR_Y_OFFSET_RPX * rpx)

    // 绘制白色背景
    ctx.setFillStyle(QR_BG_COLOR)
    ctx.fillRect(qrBgX, qrBgY, qrBgSize, qrBgSize)

    // 绘制二维码图片（使用下载后的本地路径）
    const qrX = qrBgX + qrPadding
    const qrY = qrBgY + qrPadding
    ctx.drawImage(localQrcode, qrX, qrY, qrSize, qrSize)

    // 8. 绘制底部提示文字（扫码关注查看更多好房）
    console.log('8. 绘制提示文字')
    debugMsg.value = '绘制提示文字...'
    const tipY = qrBgY + qrBgSize + Math.round(TIP_Y_OFFSET_RPX * rpx)
    ctx.setFillStyle(TIP_COLOR)
    ctx.setFontSize(Math.round(TIP_FONT_RPX * rpx))
    ctx.fillText(TIP_TEXT, canvasWidth / 2, tipY)

    // 9. 执行绘制并转换为图片
    console.log('9. 执行绘制')
    debugMsg.value = '渲染中...'
    ctx.draw(false, () => {
      console.log('10. 开始转换图片')
      debugMsg.value = '转换图片...'

      uni.canvasToTempFilePath(
        {
          canvasId: 'cardCanvas',
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth * 2,
          destHeight: canvasHeight * 2,
          fileType: 'png',
          quality: 1,
          success: (res) => {
            console.log('✅ 名片生成成功!', res.tempFilePath)
            posterImage.value = res.tempFilePath
            debugMsg.value = '生成成功！'
            uni.showToast({ title: '名片生成成功', icon: 'success' })
          },
          fail: (err) => {
            console.error('❌ 名片生成失败:', err)
            debugMsg.value = `失败: ${err.errMsg}`
            uni.showToast({ title: '名片生成失败', icon: 'none' })
          },
        },
        self,
      )
    })
  } catch (error: any) {
    console.error('❌ 错误:', error)
    debugMsg.value = `错误: ${error.message}`
    uni.showToast({ title: '名片生成失败', icon: 'none' })
  }
}

// 保存名片到相册
const savePoster = () => {
  if (!posterImage.value) {
    uni.showToast({ title: '名片生成中...', icon: 'none' })
    return
  }

  uni.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        uni.authorize({
          scope: 'scope.writePhotosAlbum',
          success: () => {
            saveImageToPhotosAlbum()
          },
          fail: () => {
            uni.showModal({
              title: '提示',
              content: '需要您授权保存相册',
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  uni.openSetting()
                }
              },
            })
          },
        })
      } else {
        saveImageToPhotosAlbum()
      }
    },
  })
}

// 保存图片到相册
const saveImageToPhotosAlbum = () => {
  uni.saveImageToPhotosAlbum({
    filePath: posterImage.value,
    success: () => {
      uni.showToast({ title: '已保存到相册', icon: 'success' })
      closePoster()
    },
    fail: (err) => {
      console.error('保存失败:', err)
      uni.showToast({ title: '保存失败', icon: 'none' })
    },
  })
}

// 对外暴露方法
defineExpose({
  openPoster,
})
</script>

<style scoped lang="scss">
// ===== 名片海报弹窗样式 =====
.card-poster-container {
  position: relative;
}

// 遮罩层【修改此处可改变遮罩层样式】
.card-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); // 遮罩背景色和透明度【修改此值改变遮罩颜色】
  z-index: 999;
}

// 海报包裹层【修改此处可改变弹窗位置】
.card-poster-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// 海报内容区【修改此处可改变海报容器样式】
.card-poster-content {
  position: relative;
  background: transparent;
  border-radius: 8px; // 海报整体圆角【修改此值改变海报圆角大小】
  overflow: hidden;
  // 已取消阴影效果
}

// Canvas 画布【修改此处可改变画布样式】
.card-poster-canvas {
  width: 375px;
  height: 667px;
  background: transparent;
}

// 调试信息【修改此处可改变调试信息样式】
.card-debug-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7); // 调试信息背景色【修改此值改变调试信息背景】
  color: #fff; // 调试信息文字颜色【修改此值改变文字颜色】
  padding: 20px;
  border-radius: 8px; // 调试信息圆角【修改此值改变圆角大小】
  font-size: 14px; // 调试信息字号【修改此值改变文字大小】
  white-space: pre-wrap;
  max-width: 300px;
  text-align: center;
}

// 按钮组【修改此处可改变按钮位置】
.card-btn-group {
  margin-top: 46px; // 按钮距离海报的距离【修改此值改变按钮位置】
  display: flex;
  gap: 15px;
}

// 保存按钮【修改此处可改变按钮样式】
.card-save-btn {
  width: 380rpx; // 按钮宽度【修改此值改变按钮宽度】
  height: 76rpx; // 按钮高度【修改此值改变按钮高度】
  background: #863fce; // 按钮背景色【修改此值改变按钮背景颜色】
  border-radius: 10rpx; // 按钮圆角【修改此值改变按钮圆角】
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx; // 按钮文字大小【修改此值改变文字大小】
  color: #ffffff; // 按钮文字颜色【修改此值改变文字颜色】
  line-height: 42rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
