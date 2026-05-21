import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingStore = defineStore("setting", () => {
  const isFold = ref<boolean>(false); // 折叠菜单
  const refresh = ref<boolean>(false); // 刷新
  const dark = ref<boolean>(false); // 暗夜模式

  return {
    isFold,
    refresh,
    dark,
  };
});
