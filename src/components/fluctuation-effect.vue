<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import { SVG, Scene } from "~/tools"

const svgRef = ref(null)

// 挂载
onMounted(() => {
  // 波动效果
  const scene = new Scene({
    svg: new SVG({ el: svgRef.value }),
    stroke: "var(--primary-color)",
  })
  scene.generate()
})
// 卸载
onUnmounted(() => {})
</script>

<template>
  <div class="h-100vh w-100vw flex justify-center items-center">
    <svg
      ref="svgRef"
      xmlns="http://www.w3.org/2000/svg"
      width="420"
      height="297"
      overflow="visible"
    ></svg>
  </div>
</template>

<style lang="scss" scoped>
svg {
  margin: 0 0 20px;
  overflow: visible !important;
  path {
    fill: none;
    stroke-width: 1px;
  }
}
</style>
