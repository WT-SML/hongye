<script setup>
import { onMounted, onUnmounted, ref, reactive } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import hongye from "~/assets/imgs/hongye.png"
import hongyeTransparent from "~/assets/imgs/hongye-transparent.png"

// 状态
const state = reactive({})

// 挂载
onMounted(() => {
  // 注册ScrollTrigger插件
  gsap.registerPlugin(ScrollTrigger)
})
// 卸载
onUnmounted(() => {})
</script>

<template>
  <div>
    <!-- 首屏 -->
    <div class="h-100vh">
      <div class="text-50px flex justify-center">你好，我是红叶。</div>
      <div class="text-24px flex justify-center items-center">
        <div class="border border-[#fff]">欲买桂花同载酒，终不似，少年游。</div>
        <img :src="hongye" class="rounded-50%" width="150" />
        <img :src="hongyeTransparent" class="rounded-50%" width="150" />
        
      </div>
    </div>
    <!-- 月落乌啼霜满天 -->
    <div>月落乌啼霜满天</div>
  </div>
</template>

<style lang="scss" scoped></style>
