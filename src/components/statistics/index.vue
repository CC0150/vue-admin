<template>
  <section class="statistics">
    <div class="statistics-grid">
      <article v-for="(item, index) in stats" :key="index" class="stat-card" :class="`stat-card--${item.type}`">
        <div class="stat-card__accent" :style="{ background: item.color }" />
        <div class="stat-card__inner">
          <div class="stat-card__icon-wrap" :style="{ background: item.color }">
            <component :is="item.icon" class="stat-card__icon" />
          </div>
          <div class="stat-card__body">
            <p class="stat-card__label">{{ item.title }}</p>
            <p class="stat-card__value">{{ item.value }}</p>
            <p v-if="item.trend" class="stat-card__trend" :class="item.trendUp ? 'is-up' : 'is-down'">
              <span class="stat-card__trend-icon">{{ item.trendUp ? '↑' : '↓' }}</span>
              {{ item.trend }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue';
import { View, User, Goods, Money } from '@element-plus/icons-vue';

interface StatItem {
  title: string;
  value: string;
  icon: object;
  type: string;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

const stats = shallowRef<StatItem[]>([
  {
    title: '今日访问',
    value: '2,890',
    icon: View,
    type: 'visit',
    color: '#409eff',
    trend: '较昨日 +12%',
    trendUp: true,
  },
  {
    title: '用户总数',
    value: '12,580',
    icon: User,
    type: 'user',
    color: '#67c23a',
    trend: '本月 +328',
    trendUp: true,
  },
  {
    title: '产品数量',
    value: '1,234',
    icon: Goods,
    type: 'product',
    color: '#e6a23c',
    trend: '较上周 -2%',
    trendUp: false,
  },
  {
    title: '总成交额',
    value: '¥98,200',
    icon: Money,
    type: 'money',
    color: '#f56c6c',
    trend: '较昨日 +8%',
    trendUp: true,
  },
]);
</script>

<style scoped lang="scss">
.statistics {
  margin-top: 24px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
    border-color: transparent;
  }

  &__accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    opacity: 0.9;
  }

  &__inner {
    position: relative;
    padding: 24px 20px;
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  &__icon-wrap {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: 24px;
    height: 24px;
    color: #fff;
  }

  &__body {
    min-width: 0;
  }

  &__label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
    margin: 0 0 6px 0;
    font-weight: 500;
  }

  &__value {
    font-size: 26px;
    font-weight: 700;
    color: var(--el-text-color-primary);
    margin: 0 0 4px 0;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  &__trend {
    font-size: 12px;
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 2px;

    &.is-up {
      color: var(--el-color-success);
    }

    &.is-down {
      color: var(--el-color-danger);
    }
  }

  &__trend-icon {
    font-size: 10px;
    opacity: 0.9;
  }
}

@media (max-width: 1200px) {
  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .stat-card__value {
    font-size: 22px;
  }
}
</style>
