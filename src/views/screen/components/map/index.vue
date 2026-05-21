<template>
  <div class="box4" ref="map" style="width: 100%; height: 800px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import chinaJSON from './china.json'

let map = ref();
echarts.registerMap('china', chinaJSON as any)

onMounted(() => {
  let mychart = echarts.init(map.value);

  // 自定义地图样式配置
  mychart.setOption({
    title: {
      text: '全国商品销售分布',
      textStyle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold'
      },
      left: 'center',
      top: '20px'
    },
    geo: {
      map: 'china',
      roam: true,
      left: '5%',
      top: '5%',
      right: '5%',
      bottom: '5%',
      // zoom: 1.2,
      label: {
        show: true,
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold'
      },
      itemStyle: {
        // 调整渐变色为蓝绿色系
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [{
            offset: 0, color: '#1488cc' // 浅蓝色
          }, {
            offset: 1, color: '#2b32b2' // 深蓝色
          }]
        },
        borderColor: '#48bfe3', // 省份边框颜色
        borderWidth: 1.5,      // 边框宽度
        shadowColor: 'rgba(69, 170, 255, 0.5)', // 阴影
        shadowBlur: 10
      },
      // 高亮效果调整
      emphasis: {
        itemStyle: {
          color: '#ff7d00', // 高亮时颜色
          borderColor: '#fff', // 边框颜色
          borderWidth: 2
        },
        label: {
          color: '#ffffff',
          fontSize: 16,
          fontWeight: 'bold'
        }
      }
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'geo',
        data: [
          { value: [116.405285, 39.904989, 10000], name: '北京' },
          { value: [121.473701, 31.230416, 8000], name: '上海' },
          { value: [113.264385, 23.12911], name: '广州' },
          { value: [114.057868, 22.543099], name: '深圳' },
          { value: [119.306239, 26.075302], name: '福州' },
          { value: [114.298572, 30.584355], name: '武汉' },
          { value: [104.066803, 30.572761], name: '成都' },
          { value: [108.940175, 34.341568], name: '西安' }
        ],
        symbolSize: function (val) {
          return val[2] / 500;
        },
        label: {
          show: false
        },
        itemStyle: {
          color: 'rgba(255, 215, 0, 0.8)',
          shadowBlur: 10,
          shadowColor: 'rgba(255, 215, 0, 0.5)'
        }
      },
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989],  // 北京
              [121.473701, 31.230416]   // 上海
            ],
            lineStyle: {
              color: 'rgba(255, 215, 0, 0.8)', // 金色航线
              width: 3,
              curveness: 0.2, // 曲线弧度
              type: 'dashed'  // 虚线样式
            }
          },
          {
            coords: [
              [116.405285, 39.904989],  // 北京
              [113.264385, 23.12911]   // 广州
            ],
            lineStyle: {
              color: 'rgba(0, 255, 255, 0.8)', // 青色航线
              width: 3,
              curveness: 0.1
            }
          }
        ],
        effect: {
          show: true,
          symbol: 'circle',
          color: 'white',
          symbolSize: 10,
          trailLength: 0.3 // 尾迹长度
        },
        lineStyle: {
          width: 2,
          opacity: 0.6,
          shadowBlur: 10
        }
      }
    ]
  })
});
</script>

<style scoped></style>