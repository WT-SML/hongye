<script setup>
import { onMounted, onUnmounted } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { POETRY } from "~/constant"

// 挂载
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  const poemLines = gsap.utils.toArray(".poetry")
  poemLines.forEach((line, i) => {
    gsap.from(line, {
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: line,
        start: "top bottom", // 当元素顶部到达视口80%时触发
        scrub: 1,
      },
    })
  })
})
// 卸载
onUnmounted(() => {})
</script>

<template>
  <div class="">
    <div v-for="item in POETRY" :key="item" class="poetry-box">
      <div class="poetry">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.poetry-box {
  width: 100vw;
  height: 100vh;
  font-size: 24px;
  white-space: nowarp;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
