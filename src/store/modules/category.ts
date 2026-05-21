import { defineStore } from "pinia";
import { ref } from "vue";
import { reqC1, reqC2, reqC3 } from "@/apis/product/attr";
import type {
  CategoryResponseData,
  CategoryObj,
} from "@/apis/product/attr/type";

export const useCategoryStore = defineStore("category", () => {
  // 获取一级分类列表
  let c1Arr = ref<CategoryObj[]>([]);
  let c1Id = ref<number | string>("");
  const getC1List = async () => {
    const res: CategoryResponseData = await reqC1();
    // console.log(result)
    if (res.code === 200) {
      c1Arr.value = res.data;
    }
  };
  // 获取二级分类列表
  let c2Arr = ref<CategoryObj[]>([]);
  let c2Id = ref<number | string>("");
  const getC2List = async () => {
    const res: CategoryResponseData = await reqC2(c1Id.value);
    if (res.code === 200) {
      c2Arr.value = res.data;
    }
  };
  // 获取三级分类列表
  let c3Arr = ref<CategoryObj[]>([]);
  let c3Id = ref<number | string>("");
  const getC3List = async () => {
    const res: CategoryResponseData = await reqC3(c2Id.value);
    if (res.code === 200) {
      c3Arr.value = res.data;
    }
  };
  //清空仓库数据
  const clearCategory = () => {
    c1Id.value = "";
    c2Id.value = "";
    c3Id.value = "";
    c1Arr.value = [];
    c2Arr.value = [];
    c3Arr.value = [];
  };

  return {
    c1Arr,
    getC1List,
    c1Id,
    c2Arr,
    getC2List,
    c2Id,
    c3Arr,
    getC3List,
    c3Id,
    clearCategory,
  };
});
