<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const main = ref()
let tl
let ctx

function toggleTimeline() {
  tl.reversed(!tl.reversed())
}

onMounted(() => {
  ctx = gsap.context((self) => {
    const boxes = gsap.utils.toArray(".box")
    tl = gsap
      .timeline()
      .to(boxes[0], { x: 120, rotation: 360 })
      .to(boxes[1], { x: -120, rotation: -360 }, "<")
      .to(boxes[2], { y: -166 })
      .reverse()
  }, main.value) // <- Scope!
})

onUnmounted(() => {
  ctx.revert() // <- Easy Cleanup!
})
</script>

<template>
  <main>
    <section class="boxes-container" ref="main">
      <h1>Use the button to toggle a Timeline</h1>
      <div>
        <button @click="toggleTimeline" class="my-5 p-3">Toggle Timeline</button>
      </div>
      <div class="box gradient-green">Box 1</div>
      <div class="box gradient-green">Box 2</div>
      <div class="box gradient-green">Box 3</div>
    </section>
  </main>
</template>

<style lang="scss" scoped>

</style>
