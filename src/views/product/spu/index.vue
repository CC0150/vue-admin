<template>
  <Category :scene="scene" />
  <el-card style="margin: 10px 0">
    <div v-show="scene === 1">
      <el-button @click="addSPU" type="primary" icon="Plus" :disabled="!categoryStore.c3Id">添加SPU</el-button>
      <el-table :data="spuList" border style="margin: 10px 0">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="SPU名称" prop="spuName" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip label="SPU描述" prop="description" align="center"></el-table-column>
        <el-table-column label="SPU操作" align="center">
          <template #="{ row }">
            <el-button @click="addSKU(row)" type="primary" icon="Plus" title="添加SKU"></el-button>
            <el-button @click="updateSPU(row)" type="warning" icon="Edit" title="修改SPU"></el-button>
            <el-button @click="viewSku(row)" type="success" icon="View" title="查看SKU列表"></el-button>
            <el-popconfirm :title="`确定删除${row.spuName}吗?`" @confirm="deleteSpu(row)" width="200">
              <template #reference>
                <el-button type="danger" icon="Delete" title="删除SPU"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
        :total="total" layout="prev, pager, next, jumper,->,sizes,total" :background="true" @current-change="getSPUList"
        @size-change="getSPUList" />
    </div>
    <!-- 添加SPU|修改SPU -->
    <SpuForm ref="spuFormRef" v-show="scene === 2" @changeScene="changeScene" />
    <!-- 添加SKU -->
    <SkuForm ref="skuFormRef" v-show="scene === 3" @changeScene="changeScene" />
    <!-- 查看sku列表对话框 -->
    <el-dialog v-model="dialogVisible" title="SKU列表" width="50%">
      <el-table :data="skuList" border style="margin: 10px 0">
        <el-table-column label="SKU名称" prop="skuName" align="center"></el-table-column>
        <el-table-column label="SKU价格(元)" prop="price" align="center"></el-table-column>
        <el-table-column label="SKU重量(g)" prop="weight" align="center"></el-table-column>
        <el-table-column label="SKU图片" align="center">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>

</template>

<script setup lang='ts'>
import Category from '@/components/category/index.vue'
import { onBeforeUnmount, ref, watch } from 'vue';
import { useCategoryStore } from '@/store/modules/category';
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/apis/product/spu';
import type { HasSpuResponseData, Records, SpuData, SkuInfoData, SkuData } from '@/apis/product/spu/type';
import SpuForm from './spuForm.vue';
import SkuForm from './skuForm.vue';
import { ElMessage } from 'element-plus';

const categoryStore = useCategoryStore()
let scene = ref<number>(1)//场景值 1:显示已有的SPU 2:添加SPU|修改SPU  3:添加SKU
let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
//控制查看sku列表对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
//获取子组件spuForm实例
const spuFormRef = ref<InstanceType<typeof SpuForm>>()
//获取子组件skuForm实例
const skuFormRef = ref<InstanceType<typeof SkuForm>>()
//存储已有的SPU列表数据
const spuList = ref<Records>([])
//存储sku数据
const skuList = ref<SkuData[]>([])


//监听三级分类id的变化
watch(() => categoryStore.c3Id, () => {
  if (categoryStore.c3Id) {
    getSPUList()
  }
})
//获取SPU列表数据
const getSPUList = async (pager = 1) => {
  pageNo.value = pager
  const res: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (res.code === 200) {
    spuList.value = res.data.records
    total.value = res.data.total
  }
}
//点击添加SPU按钮
const addSPU = () => {
  scene.value = 2
  spuFormRef.value?.initAddSpu(categoryStore.c3Id)
}
//子组件SpuForm通知父组件切换场景
const changeScene = (obj: any) => {
  scene.value = obj.scene
  if (obj.param === 'update') {
    //更新留在当前页
    getSPUList(pageNo.value)
  } else {
    //新增回到第一页
    getSPUList()
  }

}
//点击修改SPU按钮
const updateSPU = (row: SpuData) => {
  scene.value = 2
  spuFormRef.value?.initHasSpuData(row)
}
//添加SKU按钮
const addSKU = (row: SpuData) => {
  scene.value = 3
  skuFormRef.value?.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}
//查看SKU列表
const viewSku = async (row: SpuData) => {
  const res: SkuInfoData = await reqSkuList(row.id as number)
  if (res.code === 200) {
    skuList.value = res.data
    dialogVisible.value = true
  }
}
//删除SPU
const deleteSpu = async (row: SpuData) => {
  const res = await reqRemoveSpu(row.id as number)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getSPUList(spuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
}

//组件销毁前重置categoryStore
onBeforeUnmount(() => {
  categoryStore.clearCategory()
})
</script>

<style lang='scss' scoped></style>