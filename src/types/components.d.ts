import ShSwiper from '@/components/ShSwiper.vue'
import ShGuess from '@/components/ShGuess.vue'

declare module 'vue' {
  export interface GlobalComponents {
    ShSwiper: typeof ShSwiper
    ShGuess: typeof ShGuess
  }
}

// 组件实例类型
export type ShGuessInstance = InstanceType<typeof ShGuess>
export type ShSwiperInstance = InstanceType<typeof ShSwiper>
