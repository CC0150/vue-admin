<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuList">
      <el-table-column label="序号" type="index" width="120" align="center"></el-table-column>
      <el-table-column label="名称" show-overflow-tooltip prop="skuName" width="200" align="center"></el-table-column>
      <el-table-column label="默认图片" prop="skuDefaultImg" width="200" align="center">
        <template #default="{ row }">
          <el-image :src="row.skuDefaultImg" style="width: 100px; height: 100px;"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="描述" show-overflow-tooltip prop="skuDesc" width="200" align="center"></el-table-column>
      <el-table-column label="价格" prop="price" width="200" align="center"></el-table-column>
      <el-table-column label="重量" prop="weight" width="200" align="center"></el-table-column>
      <el-table-column fixed="right" label="操作" width="300" align="center">
        <template #default="{ row }">
          <el-button @click="updateSale(row)" :type="row.isSale ? 'info' : 'primary'" size="small"
            :icon="row.isSale ? 'Bottom' : 'Top'" :title="row.isSale ? '下架' : '上架'"></el-button>
          <el-button @click="edit" type="warning" size="small" icon="Edit" title="修改"></el-button>
          <el-button @click="viewSku(row)" type="success" size="small" icon="InfoFilled" title="详情"></el-button>
          <el-popconfirm :title="`确定删除${row.skuName}吗？`" @confirm="deleteSku(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" title="删除"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
      :page-sizes="[3, 5, 7, 9]" v-model:current-page="pageNo" v-model:page-size="pageSize" @current-change="getSkuList"
      @size-change="handler"></el-pagination>
    <!-- 抽屉组件————展示sku详情 -->
    <el-drawer v-model="drawer" :direction="direction">
      <template #header>
        <h3 style="font-size: 20px; font-weight: 700;">商品详情</h3>
      </template>
      <template #default>
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">重量</el-col>
          <el-col :span="18">{{ skuInfo.weight }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.id" type="success"
              style="margin: 0 10px 10px 0">{{ item.valueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item" type="success"
              style="margin: 0 10px 10px 0">{{ item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel autoplay :interval="1000" type="card" height="200px">
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img style="width: 100%;height: 100%;" :src="item.imgUrl" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { reqSkuList, reqCancelSale, reqSaleSku, reqSkuInfo, reqRemoveSku } from '@/apis/product/sku';
import type { SkuResponseData, SkuData, SkuInfoData } from '@/apis/product/sku/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1)
let pageSize = ref<number>(3)
let total = ref<number>(0)
let skuList = ref<SkuData[]>([])
//控制抽屉组件显示隐藏
let drawer = ref<boolean>(false)
//控制抽屉组件打开方向
let direction = ref<string>('rtl')
//存储sku详情数据
let skuInfo = ref<any>({})

//查看sku详情
const viewSku = async (row: SkuData) => {
  drawer.value = true
  const res: SkuInfoData = await reqSkuInfo(row.id as number)
  console.log(res.data)
  if (res.code === 200) {
    skuInfo.value = res.data
  }
}


const getSkuList = async (pager = 1) => {
  pageNo.value = pager
  const res: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (res.code === 200) {
    total.value = res.data.total
    skuList.value = res.data.records
  }
}

//分页器每页显示条数改变时触发
const handler = () => {
  getSkuList()
}

//上下架
const updateSale = async (row: SkuData) => {
  if (row.isSale) {
    const res = await reqCancelSale(row.id as number)
    if (res.code === 200) {
      ElMessage.success('下架成功')
      getSkuList(pageNo.value)
    } else {
      ElMessage.error('下架失败')
    }
  } else {
    const res = await reqSaleSku(row.id as number)
    if (res.code === 200) {
      ElMessage.success('上架成功')
      getSkuList(pageNo.value)
    } else {
      ElMessage.error('上架失败')
    }
  }
}

//修改
const edit = () => {
  ElMessage.warning('正在开发中')
}

//删除
const deleteSku = async (id: number) => {
  const res = await reqRemoveSku(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getSkuList(skuList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}

onMounted(() => {
  getSkuList()
})
</script>

<style lang='scss' scoped>
.el-col {
  margin: 10px 0;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>