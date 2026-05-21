<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="$router.push('/')">首页</span>
    </div>
    <div class="center">
      <div class="title">商品数据可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { onBeforeUnmount, onMounted, ref } from 'vue';


//获取当前时间
const time = ref<string>('');
let timer = ref<number>(0);

onMounted(() => {
  timer.value = setInterval(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    time.value = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  }, 1000);
})
onBeforeUnmount(() => {
  clearInterval(timer.value);
})
</script>

<style lang='scss' scoped>
.top {
  width: 100%;
  height: 40px;
  display: flex;

  .left {
    flex: 1;
    background: url(../../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;

    .lbtn {
      width: 150px;
      height: 40px;
      float: right;
      background: url(../../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .center {
    flex: 2;

    .title {
      width: 100%;
      height: 74px;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 40px;
      font-weight: 700;
      background: url(../../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
    }
  }

  .right {
    flex: 1;
    background: url(../../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: cover;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rbtn {
      width: 150px;
      height: 40px;
      background: url(../../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
      font-size: 20px;
    }

    .time {
      color: #29fcff;
      font-size: 20px;
      line-height: 40px;
      margin-right: 20px;
    }
  }
}
</style>