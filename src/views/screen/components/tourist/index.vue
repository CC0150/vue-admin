<template>
  <div class="tourist">
    <div class="top">
      <p class="title">实时商品销售统计</p>
      <p class="bg"></p>
      <p class="num">商品总量<span>99999</span>件</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in num" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import * as echarts from 'echarts';
//引入水球图
import 'echarts-liquidfill'
const num = ref('216908件');

const charts = ref();
onMounted(() => {
  const myChart = echarts.init(charts.value);
  const option = {
    title: {
      text: '今日销售占比',
      textStyle: {
        color: '#fff',
        fontSize: 20
      }
    },

    series: [{
      type: 'liquidFill',
      data: [0.6, 0.5, 0.4, 0.3],
      radius: '90%',
    }]
  }
  myChart.setOption(option);
})
</script>

<style lang='scss' scoped>
.tourist {
  background: url(../../images/dataScreen-main-lb.webp) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .top {
    .title {
      color: #fff;
      font-size: 25px;
      margin-top: 10px;
    }

    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.webp) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }

    .num {
      color: #fff;
      float: right;
      font-size: 20px;
      margin-right: 10px;

      span {
        color: #bc4408;
      }
    }
  }

  .number {
    margin-top: 25px;
    display: flex;
    padding: 10px;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.webp) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 30px;
      font-weight: bold;
    }
  }

  .charts {
    width: 100%;
    height: 240px;
  }
}
</style>