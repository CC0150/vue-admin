<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" v-if="flag" />
  </router-view>
</template>

<script setup lang='ts'>
import { useSettingStore } from '@/store/modules/setting';
import { nextTick, ref, watch } from 'vue';

const settingStore = useSettingStore();
const flag = ref(true);

watch(() => settingStore.refresh, () => {
  flag.value = false
  nextTick(() => {
    flag.value = true
  })
})
</script>

<style lang='scss' scoped></style>