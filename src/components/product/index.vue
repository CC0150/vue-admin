<template>
  <el-card shadow="hover" class="chart-card">
    <template #header>
      <div class="card-header">
        <span>产品分类占比</span>
      </div>
    </template>
    <div ref="chartRef" class="chart-box"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import * as echarts from 'echarts';

import { useSettingStore } from '@/store/modules/setting';

const settingStore = useSettingStore();
const chartRef = ref();
let myChart: echarts.ECharts | null = null;

const getOption = () => {
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center', textStyle: { color: settingStore.dark ? '#fff' : '#333' } },
    series: [
      {
        name: '产品分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: settingStore.dark ? '#1d1e1f' : '#fff', // 边框色适配背景
          borderWidth: 2
        },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold' } },
        data: [
          { value: 1048, name: '电子产品' },
          { value: 735, name: '服装衣帽' },
          { value: 580, name: '日用百货' },
          { value: 484, name: '生鲜食品' },
          { value: 300, name: '图书文具' }
        ]
      }
    ]
  };
};

const initChart = () => {
  if (chartRef.value) {
    myChart?.dispose();
    const theme = settingStore.dark ? 'dark' : undefined;
    myChart = echarts.init(chartRef.value, theme);
    myChart.setOption(getOption());
  }
};

watch(() => settingStore.dark, () => {
  nextTick(() => initChart());
});

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => myChart?.resize());
});
</script>

<style scoped lang="scss">
.chart-card {
  border-radius: 12px;
  overflow: hidden;

  :deep(.el-card__header) {
    border-bottom: 1px solid var(--el-border-color-lighter);
    padding: 14px 20px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  :deep(.el-card__body) {
    padding: 16px 20px 20px;
  }
}

.chart-box {
  width: 100%;
  height: 350px;
  border-radius: 8px;
  overflow: hidden;
}
</style>