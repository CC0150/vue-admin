<template>
  <div class="box8">
    <div class="title">
      <p>商品销售维度分析</p> <img src="../../images/dataScreen-title.png" alt="">
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
  let option = {
    radar: {
      indicator: [
        { name: '销售额', max: 650000 },
        { name: '销量', max: 16000 },
        { name: '客户满意度', max: 30000 },
        { name: '复购率', max: 38000 },
        { name: '客单价', max: 52000 },
        { name: '库存周转率', max: 25000 }
      ],
      axisName: {
        color: 'white' // 修正文字颜色，使其在深色背景可见
      }
    },
    series: [
      {
        name: '商品分析',
        type: 'radar',
        data: [
          {
            value: [420000, 13000, 20000, 35000, 50000, 18000],
            name: '服装类'
          },
          {
            value: [500000, 14000, 28000, 26000, 42000, 21000],
            name: '电子产品类'
          }
        ],
        areaStyle: { opacity: 0.3 }
      }
    ]
  };
  mychart.setOption(option)
})
</script>

<style scoped lang="scss">
.box8 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;

  .title {
    p {
      color: white;
      font-size: 18px;
    }

    margin:10px 0 0 10px;
  }

  .charts {
    height: calc(100% - 30px);
    margin-top: -20px;
    /* 调整一下位置 */
    margin-left: 10px;
  }
}
</style>