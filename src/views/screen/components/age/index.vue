<template>
  <div class="box2">
    <div class="title">
      <p>价格区间分析</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
let charts = ref();
onMounted(() => {
  let mychart = echarts.init(charts.value);
  let option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      right: 30,
      top: 40,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 14,
      }
    },
    series: [
      {
        name: '价格分布',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['36%', '45%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
          formatter: '{d}%' // 显示百分比
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '0-100元' },
          { value: 735, name: '100-500元' },
          { value: 580, name: '500-1000元' },
          { value: 484, name: '1000-5000元' },
          { value: 300, name: '5000元以上' }
        ]
      }
    ],
    grid: { left: 0, top: 0, right: 0, bottom: 0 }
  };
  mychart.setOption(option);
});
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;

  .title {
    margin-left: 20px;
    margin-top: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: 260px;
  }
}
</style>