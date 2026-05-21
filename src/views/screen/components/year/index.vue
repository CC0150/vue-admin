<template>
  <div class="box7">
    <div class="title">
      <p>年度商品销售趋势</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
let charts = ref();
onMounted(() => {
  let mychart = echarts.init(charts.value);
  mychart.setOption({
    title: {
      text: '2023年 vs 2024年', // 更有意义的标题
      left: 'center',
      textStyle: {
        color: 'white',
        fontSize: 16
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      top: 30,
      textStyle: { color: 'white' },
      data: ['2023', '2024']
    },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      axisLabel: { color: 'white' }
    },
    yAxis: {
      show: false // 或者设置为 true 并调整样式
    },
    grid: {
      left: 20, top: 60, right: 20, bottom: 20, containLabel: true
    },
    series: [
      {
        name: '2023',
        type: 'line',
        smooth: true,
        data: [200000, 320000, 450000, 600000, 800000, 900000, 1200000, 1400000, 1000000, 800000, 400000, 300000],
        itemStyle: { color: 'orange' }
      },
      {
        name: '2024',
        type: 'line',
        smooth: true,
        data: [220000, 380000, 550000, 700000, 950000, 1100000, 1500000, 1600000, 1200000, 900000, 500000, 350000],
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 221, 255, 0.5)' },
            { offset: 1, color: 'rgba(0, 221, 255, 0)' }
          ])
        },
        itemStyle: { color: '#00ddff' }
      }
    ]
  })
})
</script>

<style scoped lang="scss">
.box7 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    p {
      color: white;
      font-size: 18px;
    }

    margin: 10px 10px 0 0;
  }

  .charts {
    height: calc(100% - 30px);
  }
}
</style>