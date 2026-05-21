<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input v-model="skuParams.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="SKU价格(元)">
      <el-input v-model="skuParams.price" placeholder="SKU价格(元)" type="number"></el-input>
    </el-form-item>
    <el-form-item label="SKU重量(g)">
      <el-input v-model="skuParams.weight" placeholder="SKU重量(g)" type="number"></el-input>
    </el-form-item>
    <el-form-item label="SKU规格描述">
      <el-input v-model="skuParams.skuDesc" type="textarea" placeholder="SKU规格描述" :rows="4"></el-input>
    </el-form-item>
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="item in attrList" :key="item.id" :label="item.attrName" style="margin-bottom: 10px;">
          <el-select style="width: 200px;" v-model="item.attrIdAndValueId">
            <el-option v-for="item1 in item.attrValueList" :key="item1.id" :label="item1.valueName"
              :value="`${item.id}:${item1.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item style="margin-bottom: 10px;" v-for="item in saleAttrList" :key="item.id"
          :label="item.saleAttrName">
          <el-select style="width: 200px;" v-model="item.saleIdAndValueId">
            <el-option v-for="item1 in item.spuSaleAttrValueList" :key="item1.id" :label="item1.saleAttrValueName"
              :value="`${item.id}:${item1.id}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <el-form-item label="图片名称">
      <el-table ref="tableRef" border :data="imageList">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片" align="center">
          <template #="{ row }">
            <img :src="row.imgUrl" style="width: 100px; height: 100px;" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row }">
            <el-button type="primary" size="small" @click="setDefault(row)">设为默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="default" @click="save">保存</el-button>
      <el-button size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang='ts'>
import { reqAttr } from '@/apis/product/attr';
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/apis/product/spu';
import { ref } from 'vue';
import type { Attr } from '@/apis/product/attr/type';
import type { SpuImg, SaleAttr, SpuHasImg, SaleAttrResponseData } from '@/apis/product/spu/type';
import type { AttrResponseData } from '@/apis/product/attr/type';
import type { SkuData } from '@/apis/product/spu/type';
import { ElMessage } from 'element-plus';

let emit = defineEmits(['changeScene'])

//获取表格的ref
const tableRef = ref()

//平台属性
const attrList = ref<Attr[]>([])
//spu图片
const imageList = ref<SpuImg[]>([])
//销售属性
const saleAttrList = ref<SaleAttr[]>([])
//收集sku数据
const skuParams = ref<SkuData>({
  category3Id: '',//三级分类id
  spuId: '',//已有spu的id
  tmId: '',//品牌id
  skuName: '',//sku名称
  price: '',//价格
  weight: '',//重量
  skuDesc: '',//规格描述
  skuAttrValueList: [],//平台属性值
  skuSaleAttrValueList: [],//销售属性值
  skuDefaultImg: '',//默认图片
})
//设置默认图片
const setDefault = (row: SpuImg) => {
  //收集默认图片地址
  skuParams.value.skuDefaultImg = row.imgUrl!
  //设置表格中默认图片的选中状态
  //先让表格中所有的行都不选中
  tableRef.value.clearSelection()
  //再让当前点击的行选中
  tableRef.value.toggleRowSelection(row, true)
}

const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  skuParams.value.category3Id = spu.category3Id
  skuParams.value.spuId = spu.id
  skuParams.value.tmId = spu.tmId
  //获取平台属性
  const attrResult: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id)
  attrList.value = attrResult.data
  //获取spu图片
  const imageResult: SpuHasImg = await reqSpuImageList(spu.id)
  imageList.value = imageResult.data
  //获取销售属性
  const saleResult: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id)
  saleAttrList.value = saleResult.data
}

const cancel = () => {
  emit('changeScene', { scene: 1, param: '' })
}
//保存
const save = async () => {
  //收集平台属性
  skuParams.value.skuAttrValueList = attrList.value.reduce((prev: any, item: any) => {
    if (item.attrIdAndValueId) {
      let [attrId, valueId] = item.attrIdAndValueId.split(':')
      prev.push({ attrId, valueId })
    }
    return prev
  }, [])
  //收集销售属性
  skuParams.value.skuSaleAttrValueList = saleAttrList.value.reduce((prev: any, item: any) => {
    if (item.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(':')
      prev.push({ saleAttrId, saleAttrValueId })
    }
    return prev
  }, [])
  //发送请求
  const res = await reqAddSku(skuParams.value)
  if (res.code == 200) {
    ElMessage.success('添加成功')
    emit('changeScene', { scene: 1, param: '' })
  } else {
    ElMessage.error('添加失败')
  }
}

defineExpose({
  initSkuData
})
</script>

<style lang='scss' scoped></style>