<template>
  <div class="layout">
    <el-container>
      <el-aside :class="{ fold: isFold }">
        <Logo />
        <el-menu
          class="sidebar-menu"
          :default-active="route.path"
          :collapse="isFold"
          :collapse-transition="false">
          <Menu :menuList="userStore.menuRoutes" />
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <Main />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang='ts'>
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Header from './header/index.vue'
import Main from './main/index.vue'
import { useUserStore } from '@/store/modules/user';
import { useRoute } from 'vue-router';
import { useSettingStore } from '@/store/modules/setting';
import { storeToRefs } from 'pinia';

const { isFold } = storeToRefs(useSettingStore())
const route = useRoute()
const userStore = useUserStore()

</script>

<style lang='scss' scoped>
.layout {
  width: 100%;
  height: 100vh;

  .el-container {
    height: 100%;
  }

  .el-aside {
    width: $base-menu-width;
    background: #ffffff;
    border-right: 1px solid #ebeef5;
    overflow: hidden;
    transition: width 0.25s ease-in-out, background-color 0.25s ease-in-out;

    &.fold {
      width: $base-menu-fold-width;
    }

    .el-menu {
      border-right: none;
    }

    :deep(.sidebar-menu .el-menu-item),
    :deep(.sidebar-menu .el-sub-menu__title) {
      transition: padding 0.2s ease;
    }

    &.fold {
      :deep(.sidebar-menu .el-menu-item),
      :deep(.sidebar-menu .el-sub-menu__title) {
        padding-left: 16px !important;
      }
    }

    /* 菜单文字渐隐/渐显，让折叠不突兀 */
    :deep(.sidebar-menu .el-menu-item span),
    :deep(.sidebar-menu .el-sub-menu__title span) {
      transition: opacity 0.18s ease, transform 0.18s ease;
      white-space: nowrap;
    }

    &.fold {
      :deep(.sidebar-menu .el-menu-item span),
      :deep(.sidebar-menu .el-sub-menu__title span) {
        opacity: 0;
        transform: translateX(-6px);
      }
    }
  }

  .el-header {
    height: $base-header-height;
    padding: 0;
  }

  .el-main {
    overflow: auto;
    padding: 20px;
    background-color: #eee;
  }
}
</style>