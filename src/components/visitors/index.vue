<template>
  <el-card shadow="hover" class="chart-card">
    <template #header>
      <div class="card-header">
        <span>平台访问量趋势</span>
      </div>
    </template>
    <div ref="chartRef" class="chart-box"></div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import * as echarts from 'echarts';
import { useSettingStore } from '@/store/modules/setting'; // 引入 Store

const settingStore = useSettingStore();
const chartRef = ref();
let myChart: echarts.ECharts | null = null;

const getOption = () => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      axisLine: { lineStyle: { color: settingStore.dark ? '#E5EAF3' : '#909399' } } // 可选：手动微调颜色
    },
    yAxis: {
      type: 'value',
      splitLine: {
        lineStyle: { type: 'dashed', color: settingStore.dark ? '#4C4D4F' : '#E4E7ED' }
      }
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: [1200, 1320, 1010, 1340, 900, 2300, 2100],
        itemStyle: { color: '#409EFF' },
        lineStyle: { width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.5)' },
            { offset: 1, color: 'rgba(64,158,255,0.08)' }
          ]),
          shadowColor: 'rgba(64, 158, 255, 0.15)',
          shadowBlur: 12,
          shadowOffsetY: 4
        }
      }
    ]
  };
};

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    // 销毁旧实例 (如果存在)
    myChart?.dispose();
    // 核心：第二个参数传入主题，如果是暗夜模式则传 'dark'
    const theme = settingStore.dark ? 'dark' : undefined;
    myChart = echarts.init(chartRef.value, theme);
    myChart.setOption(getOption());
  }
};

// 监听暗夜模式变化
watch(() => settingStore.dark, () => {
  nextTick(() => {
    initChart(); // 重新初始化以应用新主题
  });
});

onMounted(() => {
  initChart();
  window.addEventListener('resize', () => myChart?.resize());
});

onBeforeUnmount(() => {
  myChart?.dispose(); // 防止内存泄漏
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