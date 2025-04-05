<script setup>
import { onMounted, onUnmounted } from "vue"
import homeScreen from "~/components/home-screen.vue"
import role from "~/components/role.vue"
import beian from "~/components/beian.vue"
import poetry from "~/components/poetry.vue"
import fluctuationEffect from "~/components/fluctuation-effect.vue"

// 挂载
onMounted(() => {})
// 卸载
onUnmounted(() => {})
</script>

<template>
  <div>
    <!-- 首屏 -->
    <homeScreen />
    <!-- 身份 -->
    <role />
    <!-- 诗词 -->
    <poetry />
    <!-- 波动效果 -->
    <fluctuationEffect />
    <!-- 备案 -->
    <beian />
  </div>
</template>

<style lang="scss" scoped></style>
