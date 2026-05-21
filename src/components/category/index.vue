<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select :disabled="scene === 2" placeholder="请选择" style="width: 240px" v-model="categoryStore.c1Id"
          @change="handleChange1">
          <el-option v-for="item in categoryStore.c1Arr" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select :disabled="scene === 2" placeholder="请选择" style="width: 240px" v-model="categoryStore.c2Id"
          @change="handleChange2">
          <el-option v-for="item in categoryStore.c2Arr" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene === 2" placeholder="请选择" style="width: 240px" v-model="categoryStore.c3Id">
          <el-option v-for="item in categoryStore.c3Arr" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang='ts'>
import { useCategoryStore } from '@/store/modules/category';
import { onMounted } from 'vue';

defineProps<{
  scene: number
}>()

const categoryStore = useCategoryStore();

const handleChange1 = () => {
  categoryStore.c2Id = '';
  categoryStore.c3Id = '';
  categoryStore.c2Arr = [];
  categoryStore.c3Arr = [];
  categoryStore.getC2List();
}

const handleChange2 = () => {
  categoryStore.c3Id = '';
  categoryStore.getC3List();
}

onMounted(() => {
  categoryStore.getC1List();
})
</script>

<style lang='scss' scoped></style>