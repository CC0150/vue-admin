<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist" />
          <Sex class="sex" />
          <Age class="age" />
        </div>
        <div class="center">
          <Map class="map" />
          <Line class="line" />
        </div>
        <div class="right">
          <Rank class="rank" />
          <Year class="year" />
          <Counter class="counter" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import Top from './components/top/index.vue'
import Age from './components/age/index.vue'
import Sex from './components/sex/index.vue'
import Tourist from './components/tourist/index.vue'
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
import Year from './components/year/index.vue'
import Rank from './components/rank/index.vue'
import Counter from './components/counter/index.vue'

//数据大屏展示内容盒子的dom元素
const screen = ref<HTMLDivElement>()

//定义数据大屏缩放比例
const getScale = (width = 1920, height = 1080) => {
  const ww = window.innerWidth / width
  const wh = window.innerHeight / height
  return ww < wh ? ww : wh
}
//监听窗口大小变化
window.onresize = () => {
  const scale = getScale()
  screen.value!.style.transform = `scale(${scale}) translate(-50%, -50%)`
}

onMounted(() => {
  const scale = getScale()
  screen.value!.style.transform = `scale(${scale}) translate(-50%, -50%)`
})
</script>

<style lang='scss' scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.webp) no-repeat;
  background-size: cover;

  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    .top {
      width: 100%;
      height: 40px;
    }

    .bottom {
      display: flex;

      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }

        .sex {
          flex: 1;
        }

        .age {
          flex: 1;
        }
      }

      .center {
        flex: 2;
        display: flex;
        flex-direction: column;

        .map {
          flex: 3;
        }

        .line {
          flex: 1;
        }
      }

      .right {
        flex: 1;
        display: flex;
        flex-direction: column;

        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;
        }

        .counter {
          flex: 1
        }
      }
    }
  }
}
</style>