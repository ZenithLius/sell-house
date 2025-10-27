<template>
  <view class="poster-container">
    <!-- 遮罩层 -->
    <view class="mask" v-if="showPoster" @click="closePoster"></view>

    <!-- 海报内容 -->
    <view class="poster-wrapper" v-if="showPoster">
      <view class="poster-content">
        <!-- Canvas 画布 -->
        <canvas
          canvas-id="posterCanvas"
          :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
          class="poster-canvas"
        ></canvas>

        <!-- 生成的海报图片 -->
        <!-- <image v-if="posterImage" :src="posterImage" class="poster-image" mode="widthFix"></image> -->

        <!-- 调试信息 -->
        <view v-if="!posterImage" class="debug-info">
          <text>{{ debugMsg }}</text>
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="btn-group">
        <button class="save-btn" @click="savePoster">保存相册</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, nextTick } from 'vue'

interface PosterData {
  title: string
  images: string[]
  price: string
  type: string
  area: string
  year: string
  purpose: string
  status: string
  qrcode: string
}

const showPoster = ref(false)
const posterImage = ref('')
const debugMsg = ref('初始化中...')
const sys = uni.getSystemInfoSync()
// ===== 海报整体尺寸控制 =====
const CANVAS_WIDTH_RATIO = 0.8 // 画布宽度占屏幕宽度的比例（0.8 = 80%）
const canvasWidth = Math.floor(sys.windowWidth * CANVAS_WIDTH_RATIO)
const rpx = canvasWidth / 750
// 海报整体高度（rpx）。修改此值可改变整张海报的垂直高度
const CANVAS_HEIGHT_RPX = 1200
const canvasHeight = Math.floor(CANVAS_HEIGHT_RPX * rpx)

const posterData = ref<PosterData>({
  title: '',
  images: [],
  price: '',
  type: '',
  area: '',
  year: '',
  purpose: '',
  status: '',
  qrcode: '',
})

const instance = getCurrentInstance()
const self = instance?.proxy as any

// 打开海报
const openPoster = (data: PosterData) => {
  posterData.value = data
  showPoster.value = true
  posterImage.value = ''
  debugMsg.value = '准备生成海报...'

  nextTick(() => {
    generateSimplePoster()
  })
}

// 关闭海报
const closePoster = () => {
  showPoster.value = false
  posterImage.value = ''
}

// 下载图片
const downloadImage = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni.downloadFile({
      url: url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error(`状态码: ${res.statusCode}`))
        }
      },
      fail: reject,
    })
  })
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

// 单行省略文本
const drawEllipsisText = (ctx: any, text: string, x: number, y: number, maxWidth: number) => {
  let out = text
  let suffix = ''
  while (ctx.measureText(out + suffix).width > maxWidth && out.length > 0) {
    out = out.slice(0, -1)
    suffix = '...'
  }
  ctx.fillText(out + suffix, x, y)
}

// 虚线（兼容）
const drawDashedLine = (
  ctx: any,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  dash = 6,
  gap = 6,
) => {
  const anyCtx = ctx as any
  if (typeof anyCtx.setLineDash === 'function') {
    anyCtx.setLineDash([dash, gap])
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    anyCtx.setLineDash([])
  } else {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    const step = dash + gap
    const steps = Math.floor(len / step)
    const vx = (dx / len) * step
    const vy = (dy / len) * step
    let cx = x1
    let cy = y1
    for (let i = 0; i < steps; i++) {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + (dx / len) * dash, cy + (dy / len) * dash)
      ctx.stroke()
      cx += vx
      cy += vy
    }
  }
}

// 简化版生成海报（先测试基础功能）
const generateSimplePoster = async () => {
  try {
    debugMsg.value = '开始绘制...'
    console.log('===== 开始生成海报 =====')

    const ctx = uni.createCanvasContext('posterCanvas', self)
    ctx.setTextBaseline('top')

    // 1. 绘制背景图（本地图片）
    console.log('1. 绘制背景图')
    debugMsg.value = '绘制背景图...'

    // 使用本地背景图，路径根据你的项目调整
    // 如果背景图在 static 文件夹，路径是 /static/poster-bg.png
    const bgPath = '/static/index/poster-bg.png'
    ctx.drawImage(bgPath, 0, 0, canvasWidth, canvasHeight)

    // 2. 标题与布局
    // ===== 可调样式参数（集中入口，单位除特别说明外均为 rpx）=====
    // — 画布与网格内边距/间距
    const PADDING_X_RPX = 40 // 左右内边距（改大→整体更窄，改小→更宽）
    const PADDING_TOP_RPX = 50 // 顶部内边距（标题距画布顶部）
    const COL_GAP_RPX = 30 // 两列图片之间的水平间距
    const ROW_GAP_RPX = 30 // 行与行之间的垂直间距
    const GRID_CELL_HEIGHT_RATIO = 0.82 // 图片单元的高宽比：cellH = cellW * 该系数

    // — 标题样式
    const TITLE_FONT_RPX = 30 // 标题字号
    const TITLE_LINE_RPX = 38 // 标题行高（用于计算网格起始 Y）
    const TITLE_MARGIN_BOTTOM_RPX = 12 // 标题与图片网格之间的间距

    // — 上排图片样式（带边框）
    const TOP_ROW_RADIUS_RPX = 10 // 圆角大小
    const TOP_ROW_BORDER_WIDTH_PX = 1 // 边框粗细（px 像素单位）

    // — 下排图片样式（无边框，仅圆角裁剪）
    const BOTTOM_ROW_RADIUS_PX = 8 // 圆角（px）

    // — 分割线与间距
    const DIVIDER_GAP_RPX = 50 // 图片网格底部到分割线的间距
    const DASH_RPX = 6 // 分割线短划长度
    const GAP_RPX = 6 // 分割线间隔长度

    // — 底部信息（粗体一行+小字一行）与二维码
    const INFO_FONT_RPX = 29 // 粗体行字号（价格 | 户型 | 面积）
    const INFO_MARGIN_TOP_RPX = 80 // 分割线到底部粗体行的垂直间距
    const SMALL_FONT_RPX = 20 // 小字字号（“扫码关注查看更多好房”）
    const SMALL_FONT_MARGIN_TOP_RPX = 50 // 粗体行到小字的垂直间距
    const INFO_QR_SIZE_RPX = 116 // 右侧二维码尺寸
    const INFO_QR_TOP_OFFSET_RPX = 50 // 二维码顶部距离分割线的垂直间距
    const QR_TEXT_RESERVE_RPX = 16 // 为避免文字压到二维码，文本右侧额外预留空间

    // ===== 将 rpx 转为 px（实际绘制使用 px）=====
    const paddingX = Math.round(PADDING_X_RPX * rpx)
    const paddingTop = Math.round(PADDING_TOP_RPX * rpx)
    const colGap = Math.round(COL_GAP_RPX * rpx)
    const rowGap = Math.round(ROW_GAP_RPX * rpx)
    console.log('2. 绘制标题')
    debugMsg.value = '绘制标题...'
    ctx.fillStyle = '#030509'
    // 标题字号（修改 TITLE_FONT_RPX 即可）
    ctx.setFontSize(Math.round(TITLE_FONT_RPX * rpx))
    const titleX = paddingX
    const titleY = paddingTop
    const titleMaxWidth = canvasWidth - paddingX * 2
    drawEllipsisText(ctx, posterData.value.title, titleX, titleY, titleMaxWidth)

    // 3. 图片网格（2列等宽，3行）
    console.log('3. 绘制图片网格')
    debugMsg.value = '下载图片中...'
    // 图片网格起始 Y：标题行高 + 标题与网格间距（修改 TITLE_LINE_RPX / TITLE_MARGIN_BOTTOM_RPX）
    const gridTop =
      titleY + Math.round(TITLE_LINE_RPX * rpx) + Math.round(TITLE_MARGIN_BOTTOM_RPX * rpx)
    const cellW = Math.floor((canvasWidth - paddingX * 2 - colGap) / 2)
    // 单元格高度：cellW * 比例（修改 GRID_CELL_HEIGHT_RATIO）
    const cellH = Math.floor(cellW * GRID_CELL_HEIGHT_RATIO)

    // 逐个下载并绘制
    for (let i = 0; i < Math.min(posterData.value.images.length, 6); i++) {
      try {
        debugMsg.value = `下载图片 ${i + 1}/6...`
        const url = posterData.value.images[i]
        console.log(`下载第${i + 1}张图片:`, url)

        const localPath = await downloadImage(url)
        console.log(`第${i + 1}张下载成功，开始绘制`)

        const row = Math.floor(i / 2)
        const col = i % 2
        const x = paddingX + col * (cellW + colGap)
        const y = gridTop + row * (cellH + rowGap)

        // 顶部一行带边框，下面两行无边框
        // 上排圆角半径（rpx），修改 TOP_ROW_RADIUS_RPX
        const borderRpx = TOP_ROW_RADIUS_RPX
        const rpx2px = canvasWidth / 750
        const radiusPx = Math.max(Math.round(borderRpx * rpx2px), 4)
        // 上排边框粗细（px），修改 TOP_ROW_BORDER_WIDTH_PX
        const borderWidth = TOP_ROW_BORDER_WIDTH_PX

        // 下方图片：无边框，仅圆角裁剪（修改 BOTTOM_ROW_RADIUS_PX）
        ctx.save()
        drawRoundRect(ctx, x, y, cellW, cellH, BOTTOM_ROW_RADIUS_PX)
        ctx.clip()
        ctx.drawImage(localPath, x, y, cellW, cellH)
        ctx.restore()

        console.log(`第${i + 1}张绘制完成`)
      } catch (error) {
        console.error(`第${i + 1}张图片失败:`, error)
      }
    }

    // 5. 绘制分割线
    console.log('5. 绘制分割线')
    ctx.strokeStyle = '#E5D5FF'
    ctx.lineWidth = 1
    // 图片网格底部与分割线位置（修改 DIVIDER_GAP_RPX 调整分割线上下位置）
    const gridBottom = gridTop + cellH * 3 + rowGap * 2
    const dividerY = gridBottom + Math.round(DIVIDER_GAP_RPX * rpx)
    // 分割线的 dash/gap 可通过 DASH_RPX/GAP_RPX 调整
    // drawDashedLine(
    //   ctx,
    //   paddingX,
    //   dividerY,
    //   canvasWidth - paddingX,
    //   dividerY,
    //   Math.max(4, Math.round(DASH_RPX * rpx)),
    //   Math.max(4, Math.round(GAP_RPX * rpx)),
    // )

    // 6. 底部信息（仅一行：价格 | 户型 | 面积）
    console.log('6. 绘制底部信息')
    debugMsg.value = '绘制信息...'
    // 粗体信息行 Y（修改 INFO_MARGIN_TOP_RPX 调整与分割线间距）
    const infoY = dividerY + Math.round(INFO_MARGIN_TOP_RPX * rpx)
    ctx.fillStyle = '#030509'
    // 粗体信息字号（修改 INFO_FONT_RPX）
    ctx.setFontSize(Math.round(INFO_FONT_RPX * rpx))
    const infoLine = `${posterData.value.price} | ${posterData.value.type} | ${posterData.value.area}`
    // 右侧为二维码预留空间（修改 INFO_QR_SIZE_RPX / QR_TEXT_RESERVE_RPX）
    const qrReserve = Math.round(QR_TEXT_RESERVE_RPX * rpx)
    const infoMaxWidth = canvasWidth - paddingX * 2 - Math.round(INFO_QR_SIZE_RPX * rpx) - qrReserve
    drawEllipsisText(ctx, infoLine, paddingX, infoY, infoMaxWidth)
    // 房价行下方小字（与粗体间距20rpx）
    ctx.fillStyle = '#939393'
    // 小字字号（修改 SMALL_FONT_RPX）与间距（修改 SMALL_FONT_MARGIN_TOP_RPX）
    ctx.setFontSize(Math.round(SMALL_FONT_RPX * rpx))
    ctx.fillText(
      '扫码关注查看更多好房',
      paddingX,
      infoY + Math.round(SMALL_FONT_MARGIN_TOP_RPX * rpx),
    )

    // 7. 下载并绘制二维码
    console.log('7. 处理二维码')
    debugMsg.value = '下载二维码...'
    // 二维码尺寸与位置（修改 INFO_QR_SIZE_RPX / INFO_QR_TOP_OFFSET_RPX）
    const qrSize = Math.round(INFO_QR_SIZE_RPX * rpx)
    const qrX = canvasWidth - qrSize - paddingX
    const qrY = dividerY + Math.round(INFO_QR_TOP_OFFSET_RPX * rpx)

    try {
      const qrPath = await downloadImage(posterData.value.qrcode)
      console.log('二维码下载成功')

      // 直接绘制二维码（无白边）
      ctx.drawImage(qrPath, qrX, qrY, qrSize, qrSize)
    } catch (error) {
      console.error('二维码下载失败:', error)
    }

    // 取消底部小字说明，仅保留二维码

    // 取消来源编号，不再绘制

    // 9. 执行绘制
    console.log('8. 执行draw')
    debugMsg.value = '渲染中...'
    ctx.draw(false, () => {
      console.log('9. 开始转换图片')
      debugMsg.value = '转换图片...'

      uni.canvasToTempFilePath(
        {
          canvasId: 'posterCanvas',
          x: 0,
          y: 0,
          width: canvasWidth,
          height: canvasHeight,
          destWidth: canvasWidth * 2,
          destHeight: canvasHeight * 2,
          fileType: 'png',
          quality: 1,
          success: (res) => {
            console.log('✅ 成功!', res.tempFilePath)
            posterImage.value = res.tempFilePath
            debugMsg.value = '生成成功！'
            uni.showToast({ title: '生成成功', icon: 'success' })
          },
          fail: (err) => {
            console.error('❌ 失败:', err)
            debugMsg.value = `失败: ${err.errMsg}`
            uni.showToast({ title: '生成失败', icon: 'none' })
          },
        },
        self,
      )
    })
  } catch (error: any) {
    console.error('❌ 错误:', error)
    debugMsg.value = `错误: ${error.message}`
    uni.showToast({ title: '生成失败', icon: 'none' })
  }
}

// 保存海报
const savePoster = () => {
  if (!posterImage.value) {
    uni.showToast({ title: '海报生成中...', icon: 'none' })
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

const saveImageToPhotosAlbum = () => {
  uni.saveImageToPhotosAlbum({
    filePath: posterImage.value,
    success: () => {
      uni.showToast({ title: '已保存到相册', icon: 'success' })
    },
    fail: (err) => {
      console.error('保存失败:', err)
      uni.showToast({ title: '保存失败', icon: 'none' })
    },
  })
}

defineExpose({
  openPoster,
})
</script>

<style scoped lang="scss">
.poster-container {
  position: relative;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
}

.poster-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster-content {
  position: relative;
  background: transparent;
  border-radius: 4px; /* 整体海报圆角大小，可改为 16px、20px 等 */
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.poster-canvas {
  width: 375px;
  height: 667px;
  background: transparent;
}

.poster-image {
  width: 375px;
  display: block;
}

.debug-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  font-size: 14px;
  white-space: pre-wrap;
  max-width: 300px;
  text-align: center;
}

.btn-group {
  margin-top: 46px;
  display: flex;
  gap: 15px;
}

.save-btn,
.close-btn {
  width: 380rpx;
  height: 76rpx;
  background: #863fce;
  border-radius: 10rpx;
}

.save-btn {
  font-family: Source Han Sans CN;
  font-weight: 400;
  font-size: 28rpx;
  color: #ffffff;
  line-height: 42rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-btn {
  background: #fff;
  color: #666;
  border: 1px solid #e5e5e5;
}
</style>
