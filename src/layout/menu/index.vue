<template>
  <template v-for="item in props.menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item.children">
      <el-menu-item :index="item.path" v-if="!item.meta?.hidden" @click="goRoute">
        <el-icon>
          <component :is="item.meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 只有一个子路由 -->
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item :index="item.children[0].path" v-if="!item.children[0].meta?.hidden" @click="goRoute">
        <el-icon>
          <component :is="item.children[0].meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有多个子路由 -->
    <el-sub-menu v-if="item.children && item.children.length > 1" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="item.meta?.icon"></component>
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <!-- 递归组件 -->
      <Menu :menuList="item.children" />
    </el-sub-menu>
  </template>
</template>

<script setup lang='ts' name="Menu">
import type { RouteRecordRaw } from "vue-router";
import { useRouter } from "vue-router";

import Menu from "./index.vue";
// 获取父组件传来的所有的路由数组
const props = defineProps<{
  menuList: RouteRecordRaw[]
}>();

const router = useRouter();
const goRoute = (path: any) => {
  router.push(path.index);
};
</script>

<style lang='scss' scoped></style>
