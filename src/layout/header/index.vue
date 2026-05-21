<template>
  <div class="header">
    <div class="left">
      <el-icon style="margin: 0 10px;padding-top: 2px;" @click="changeIcon">
        <component :is="isFold ? 'Expand' : 'Fold'" />
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in route.matched" :to="item.path" :key="index"
          v-show="item.meta.title">
          <el-icon style="margin: 0 5px;" v-if="item.meta.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 右侧操作区异步加载，减少首屏 bundle -->
    <HeaderRight />
  </div>
</template>

<script setup lang='ts' name="Header">
import { defineAsyncComponent } from 'vue';
import { useSettingStore } from '@/store/modules/setting';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const HeaderRight = defineAsyncComponent(() => import('./HeaderRight.vue'))

const route = useRoute()
const { isFold } = storeToRefs(useSettingStore())

const changeIcon = () => {
  isFold.value = !isFold.value
}
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;

  .left {
    display: flex;
    align-items: center;
  }
}
</style>
