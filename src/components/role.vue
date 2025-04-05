<script setup>
import { onMounted, onUnmounted } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
// 挂载
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  let sections = gsap.utils.toArray(".role-item")
  let scrollTween = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".roles",
      pin: true,
      scrub: 1,
    },
  })
})
// 卸载
onUnmounted(() => {})
</script>

<template>
  <div class="h-100vh w-100vw flex overflow-x-hidden roles">
    <div class="role-item">
      <div class="title">全栈工程师</div>
      <div class="desc">JavaScript / TypeScript / NodeJs / Python / Go</div>
    </div>
    <div class="role-item">
      <div class="title">独立游戏作者</div>
      <div class="desc">Unreal Engine / Unity / Godot</div>
    </div>
    <div class="role-item">
      <div class="title">作家</div>
      <div class="desc">《余笙不安》/《星映诸天》</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.role-item {
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
  .title {
    font-size: 24px;
    margin-bottom: 1rem;
  }
}
</style>
