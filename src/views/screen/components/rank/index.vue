<template>
    <div class="box6">
        <div class="title">
            <p>热门商品排行</p>
            <img src="../../images/dataScreen-title.webp" alt="">
        </div>
        <div class="charts" ref='charts'></div>
    </div>
</template>

<script setup lang="ts">
import echarts from '@/utils/echarts';
import { ref, onMounted } from 'vue';
let charts = ref();
onMounted(() => {
    let mychart = echarts.init(charts.value);
    mychart.setOption({
        title: {
            text: '商品销量TOP7',
            left: '50%',
            textStyle: {
                color: 'yellowgreen',
                fontSize: 20
            },
            subtext: "实时销量",
            subtextStyle: {
                color: 'yellowgreen',
                fontSize: 16
            }
        },
        xAxis: {
            type: 'category',
            // 添加具体商品名称
            data: ['智能手机', '笔记本电脑', '智能手表', '无线耳机', '平板电脑', '智能音箱', '游戏主机'],
            axisLabel: {
                color: 'white', // 坐标轴文字颜色
                interval: 0 // 强制显示所有标签
            }
        },
        yAxis: {
            show: false // 隐藏Y轴，更简洁
        },
        grid: {
            left: 20,
            bottom: 20,
            right: 20
        },
        series: [
            {
                type: 'bar',
                // 数据降序排列，符合排行逻辑
                data: [9800, 8800, 7500, 6600, 5400, 4200, 3000],
                label: {
                    show: true,
                    position: 'insideTop',
                    color: 'white'
                },
                showBackground: true,
                backgroundStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [{ offset: 0, color: 'black' }, { offset: 1, color: 'blue' }],
                        global: false
                    }
                },
                itemStyle: {
                    borderRadius: [10, 10, 0, 0],
                    color: function (data: any) {
                        let arr = ['red', 'orange', 'yellowgreen', 'green', 'purple', 'hotpink', 'skyblue'];
                        return arr[data.dataIndex];
                    }
                }
            }
        ],
        tooltip: {
            backgroundColor: 'rgba(50,50,50,0.7)'
        }
    })
})
</script>

<style scoped lang="scss">
.box6 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.webp) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;

    .title {
        margin-right: 10px;
        margin-top: 20px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .charts {
        height: calc(100% - 30px);
    }
}
</style>