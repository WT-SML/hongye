<script setup>
import { onMounted, onUnmounted, ref, reactive } from "vue"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
// @ts-ignore
import hongye from "~/assets/imgs/hongye.png"
// @ts-ignore
import hongyeTransparent from "~/assets/imgs/hongye-transparent.png"
// @ts-ignore
import { POETRY } from "~/constant"
// @ts-ignore
import { sleep, Rays, Cursor } from "~/tools"

const raysRef = ref(null)

const currentPoetry = ref("")
const tempPoetry = ref("")

// 状态
const state = reactive({})

// 启动诗词
const startPoetry = async () => {
  currentPoetry.value =
    POETRY[POETRY.indexOf(currentPoetry.value) + 1] || POETRY[0]
  gsap.to(
    {},
    {
      duration: currentPoetry.value.length * 0.1,
      // @ts-ignore
      onUpdate: async function () {
        // @ts-ignore
        const progress = this.progress()
        const charIndex = Math.floor(progress * currentPoetry.value.length)
        tempPoetry.value = currentPoetry.value.substring(0, charIndex)
        if (tempPoetry.value === currentPoetry.value) {
          await sleep(5000)
          while (tempPoetry.value) {
            tempPoetry.value = tempPoetry.value.slice(0, -1)
            await sleep(40)
          }
          startPoetry()
        }
      },
    }
  )
}

// 挂载
onMounted(() => {
  // 注册插件
  gsap.registerPlugin(ScrollTrigger)
  gsap.registerPlugin(TextPlugin)
  // 雨
  new Rays({
    el: raysRef.value,
  })
  // 鼠标
  new Cursor()
  // 启动诗词
  startPoetry()
})
// 卸载
onUnmounted(() => {})
</script>

<template>
  <div>
    <!-- 首屏 -->
    <div
      class="h-100vh flex flex-col justify-center items-center relative overflow-hidden relative"
    >
      <!-- 背景 -->
      <div class="absolute w-full h-full top-0 left-0 z-[-1]">
        <!-- 雨 -->
        <div ref="raysRef" class="rays"></div>
        <!-- 鼠标 -->
        <div class="cursor">
          <svg width="1920" height="1080" class="cursor-scene">
            <g class="cursor-wrapper"></g>
            <defs>
              <filter id="goo">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="25"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -1"
                  result="goo"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <!-- 红叶如潮 -->
      <div class="text-48px flex justify-center mb-10" >红叶如潮。</div>
      <!-- 对话 -->
      <div class="text-18px">
        <div
          class="border border-[#fff] py-1 px-3 rounded-3 bg-#fff text-#171717 relative"
        >
          <div class="whitespace-nowrap min-w-30px poetry-box">
            <span>{{ tempPoetry }}</span>
            <span
              class="cursor translate-y-[-1px] inline-block"
              style="color: var(--primary-color)"
            >
              |
            </span>
          </div>
          <div
            class="w-0 h-0 border-20px border-#fff border-l-transparent border-r-transparent border-t-transparent absolute right-[-2px] bottom-[-5px] rotate-36 z-[-1]"
          ></div>
          <img
            :src="hongye"
            class="rounded-50% absolute right-[-20px] bottom-[-60px] border"
            width="40"
          />
        </div>
      </div>
      <!-- 下箭头 -->
    </div>
    <!-- 小车 -->
     <!-- TODO: -->
  </div>
</template>

<style lang="scss" scoped>
.poetry-box {
  .cursor {
    animation: blink 0.8s infinite;
  }
  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
}
.rays {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200vh;
  height: 200vw;
  background-image: repeating-linear-gradient(
    50deg,
    #00f8f1 0,
    #ffbd1e 20px,
    #fe848f 40px,
    #ffbd1e 60px,
    #00f8f1 80px
  );
  transform: translate3d(-50%, -50%, 0) rotate(-70deg);
}
.cursor {
  svg {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3;

    display: block;
    overflow: visible;
    width: 100%;
    height: 100%;

    filter: url("#goo");
    mix-blend-mode: color-dodge;
  }
  &__pointer {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 4;

    overflow: hidden;
    width: 10px;
    height: 10px;

    background: red;
    border: 1px solid #083640;
    border-radius: 50%;
    opacity: 0.99;
    transform: translate3d(
      calc(var(--mouse-x) * 1px - 50%),
      calc(var(--mouse-y) * 1px - 50%),
      0
    );

    will-change: transform;

    &:before {
      position: absolute;
      width: 400%;
      height: 100%;

      background: linear-gradient(
          45deg,
          #4cede1,
          #ffc53a,
          #ff858d,
          #ffc53a,
          #4cede1
        )
        0 0 / 66.66% 100%;

      animation: pointer-gradient 1s linear infinite;
      will-change: transform;

      content: "";
    }
  }
}
</style>
