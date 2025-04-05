<script setup lang="js">
import { onMounted, onUnmounted, ref } from "vue"
import gsap from "gsap"
import hongye from "~/assets/imgs/hongye.png"
import { POETRY } from "~/constant"
import { sleep, Rays, Cursor } from "~/tools"

const raysRef = ref(null)

const currentPoetry = ref("")
const tempPoetry = ref("")

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
    <div class="text-48px flex justify-center mb-10 pl-5">红叶如潮。</div>
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
    <div
      class="arrow-animated absolute bottom-15 left-[50%] translate-x-[-50%]"
    >
      <svg
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="1464"
        width="25"
        height="25"
      >
        <path
          d="M512 960c-247.039484 0-448-200.960516-448-448S264.960516 64 512 64 960 264.960516 960 512 759.039484 960 512 960zM512 128c-211.744443 0-384 172.255557-384 384s172.255557 384 384 384 384-172.255557 384-384S723.744443 128 512 128z"
          fill="#ffffff"
          p-id="1465"
        ></path>
        <path
          d="M694.559548 522.144013c-12.54369-12.607338-33.375299-12.640022-45.951673-0.063647l-104.608735 103.903454L543.99914 319.327402c0-17.759333-14.208843-32.160839-32.00086-32.160839-17.759333 0-32.00086 14.399785-32.00086 32.160839l0 308.319849-105.215966-106.688456c-12.480043-12.607338-32.704421-12.736353-45.311759-0.25631-12.640022 12.512727-12.672705 32.895364-0.192662 45.504421l159.359226 161.055342c6.271845 6.335493 14.592447 9.567746 22.880366 9.567746 8.160624 0 16.383174-3.168606 22.624056-9.311437 0.032684-0.063647 0.032684-0.063647 0.063647-0.127295 0.032684 0 0.063647 0 0.096331-0.063647l160.191802-159.679183C707.072275 555.104744 707.103239 534.720387 694.559548 522.144013z"
          fill="#ffffff"
          p-id="1466"
        ></path>
      </svg>
    </div>
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
.arrow-animated {
  font-size: 1em;
  animation: arrow-float 1s infinite;
}

@keyframes arrow-float {
  0% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
  60% {
    transform: translateY(50%);
    animation-timing-function: ease-in-out;
  }
  100% {
    transform: translateY(0);
    animation-timing-function: ease-out;
  }
}
</style>
