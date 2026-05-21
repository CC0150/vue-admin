<template>
  <div class="home-container">

    <Statistics />

    <div class="charts-container">
      <el-row :gutter="20">
        <el-col :span="16">
          <VisitorsTrend />
        </el-col>
        <el-col :span="8">
          <ProductPie />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang='ts'>
import Statistics from '@/components/statistics/index.vue'
import VisitorsTrend from '@/components/visitors/index.vue'
import ProductPie from '@/components/product/index.vue'

</script>

<style lang='scss' scoped>
.home-container {
  .welcome-card {
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .box {
    display: flex;
    align-items: center;

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 2px solid #f0f2f5;
    }

    .text {
      margin-left: 20px;

      h3 {
        font-size: 24px;
        margin-bottom: 10px;
        font-weight: 700;
        color: #303133;
      }

      p {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .charts-container {
    margin-top: 20px;

    :deep(.el-card) {
      border-radius: 12px;
      overflow: hidden;
    }
  }
}
</style>