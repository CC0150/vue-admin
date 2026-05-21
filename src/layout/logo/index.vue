<template>
  <div class="logo">
    <img v-if="setting.showLogo" src="/logo.svg" alt="logo" />
    <p v-if="!isFold">{{ setting.title }}</p>
  </div>
</template>

<script setup lang='ts' name="Logo">
//引入设置logo和标题
import setting from '@/setting';
import { useSettingStore } from '@/store/modules/setting';
import { storeToRefs } from 'pinia';

const { isFold } = storeToRefs(useSettingStore())
</script>

<style lang='scss' scoped>
.logo {
  color: #303133;
  display: flex;
  align-items: center;
  padding: 10px;

  img {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  p {
    font-size: 20px;
  }
}
</style>