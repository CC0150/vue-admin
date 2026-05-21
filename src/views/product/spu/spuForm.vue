<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称" style="width: 50%;">
      <el-input placeholder="请输入SPU名称" v-model="spuParams.spuName"></el-input>
    </el-form-item>

    <el-form-item label="SPU品牌">
      <el-select style="width:200px" v-model="spuParams.tmId" placeholder="请选择品牌">
        <el-option v-for="(item) in allTradeMarkData" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input v-model="spuParams.description" type="textarea" placeholder="请输入SPU描述" :rows="4" />
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
        :headers="headers" :on-preview="handlePictureCardPreview" :before-upload="handlerUpload">
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%;" />
      </el-dialog>
    </el-form-item>

    <el-form-item label="SPU销售属性">
      <el-select v-model="saleAttrIdName" style="width:200px"
        :placeholder="unSelectAttr.length ? `还有${unSelectAttr.length}个属性未选择` : '暂无属性可选'">
        <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectAttr" :key="item.id"
          :label="item.name"></el-option>
      </el-select>
      <el-button @click="addSaleAttr" :disabled="!saleAttrIdName" type="primary" size="default" icon="Plus"
        style="margin-left: 20px;">添加销售属性</el-button>
      <el-table border style="margin: 10px 0;" :data="saleAttrList">
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" width="120" prop="saleAttrName" align="center"></el-table-column>
        <el-table-column label="属性值名称列表" align="center">
          <template #="{ row, $index }">
            <el-tag v-for="(item, index) in row.spuSaleAttrValueList" :key="item.id" style="margin-right: 10px;"
              class="mx-1" closable @close="row.spuSaleAttrValueList.splice(index, 1)">{{
                item.saleAttrValueName }}</el-tag>
            <el-input ref="inputRef" v-if="row.flag" style="margin-right: 10px;width: 100px;" placeholder="请输入属性值"
              size="small" v-model="row.saleAttrValue" @blur="toLook(row)" @keyup.enter="toLook(row)"></el-input>
            <el-button v-else type="success" size="small" icon="Plus" @click="addSaleAttrValue(row)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label=" 操作" width="120" align="center">
          <template #="{ row, $index }">
            <el-button type="danger" size="small" icon="Delete" @click="saleAttrList.splice($index, 1)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button @click="save" style="width: 100px;" type="primary" size="default">保存</el-button>
      <el-button style="width: 100px;" size="default" @click="cancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script setup lang='ts'>
import type { SpuData } from '@/apis/product/spu/type';
import { reqAllTradeMark, reqSpuHasSaleAttr, reqSpuImageList, reqAllSaleAttr, reqAddOrUpdateSpu } from '@/apis/product/spu';
import type { HasSaleAttr, SaleAttrValue, SaleAttr, SpuImg, Trademark, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData } from '@/apis/product/spu/type';
import { computed, nextTick, ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';

const userStore = useUserStore()
const headers = { Token: userStore.token }
let emit = defineEmits(['changeScene'])
//通知父组件切换场景
const cancel = () => {
  emit('changeScene', {
    scene: 1,
    param: 'update'
  })
}
//保存spu信息
const save = async () => {
  //整理参数
  spuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  spuParams.value.spuSaleAttrList = saleAttrList.value
  //发请求
  const res = await reqAddOrUpdateSpu(spuParams.value)
  if (res.code === 200) {
    ElMessage.success(spuParams.value.id ? '修改成功' : '添加成功')
    emit('changeScene', {
      scene: 1,
      param: spuParams.value.id ? 'update' : 'add'
    })
  } else {
    ElMessage.error(spuParams.value.id ? '修改失败' : '添加失败')
  }
}
//添加一个spu初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
  //清空数据
  Object.assign(spuParams.value, {
    category3Id: 0,//三级分类id
    description: '',//描述
    spuName: '',//spu名称
    tmId: '',//品牌id
    spuImageList: [],//spu图片列表
    spuSaleAttrList: [],//spu销售属性列表
  })
  //清空图片列表
  imgList.value = []
  //清空销售属性列表
  saleAttrList.value = []
  //清空全部销售属性列表
  saleAttrIdName.value = ''
  //存储三级分类id
  spuParams.value.category3Id = c3Id as number
  //获取全部品牌的数据
  const res: AllTradeMark = await reqAllTradeMark()
  allTradeMarkData.value = res.data
  //获取全部销售属性的数据
  const res1: HasSaleAttrResponseData = await reqAllSaleAttr()
  allSaleAttrList.value = res1.data
}

//计算当前spu还未拥有的销售属性
const unSelectAttr = computed(() => {
  let unSelectArr = allSaleAttrList.value.filter((item) => {
    return saleAttrList.value.every((item1) => {
      return item.name !== item1.saleAttrName
    })
  })
  return unSelectArr
})
//收集还未选择的销售属性的id和name
let saleAttrIdName = ref<string>('')
//添加销售属性
const addSaleAttr = () => {
  let [baseSaleAttrId, saleAttrName] = saleAttrIdName.value.split(':')
  // 准备一个新的销售属性对象：将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId: parseInt(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  saleAttrList.value.push(newSaleAttr)
  saleAttrIdName.value = ''
}

//存储全部品牌数据
const allTradeMarkData = ref<Trademark[]>([])
//存储spu图片列表数据
const imgList = ref<SpuImg[]>([])
//存储spu销售属性数据
const saleAttrList = ref<SaleAttr[]>([])
//存储全部销售属性数据
const allSaleAttrList = ref<HasSaleAttr[]>([])
//存储已有的spu对象
let spuParams = ref<SpuData>({
  category3Id: 0,//三级分类id
  description: '',//描述
  spuName: '',//spu名称
  tmId: '',//品牌id
  spuImageList: [],//spu图片列表
  spuSaleAttrList: [],//spu销售属性列表
})

//定义ref获取表单元素
const inputRef = ref<any>()

//添加销售属性值
const addSaleAttrValue = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
  nextTick(() => {
    inputRef.value.focus()
  })
}
//表单元素失去焦点的回调
const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SaleAttrValue =
  {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  //判断属性值是否为空
  if (saleAttrValue?.trim() === '') {
    ElMessage.error('属性值不能为空')
    return
  }
  //判断属性值是否重复
  if (row.spuSaleAttrValueList.some((item) => {
    return item.saleAttrValueName === saleAttrValue
  })) {
    ElMessage.error('属性值不能重复')
    return
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

const initHasSpuData = async (spu: SpuData) => {
  //spu:即为父组件传来的spu对象【不完整】
  spuParams.value = spu
  //获取全部品牌列表数据
  const res: AllTradeMark = await reqAllTradeMark()
  //获取spu图片列表数据
  const res1: SpuHasImg = await reqSpuImageList(spu.id as number)
  //获取spu销售属性数据
  const res2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取全部销售属性数据
  const res3: HasSaleAttrResponseData = await reqAllSaleAttr()
  //将数据存储到响应式数据中
  allTradeMarkData.value = res.data
  imgList.value = res1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttrList.value = res2.data
  allSaleAttrList.value = res3.data
}

//图片预览
const dialogImageUrl = ref<string>('')
const dialogVisible = ref<boolean>(false)
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}

//上传图片之前
const handlerUpload = (rawFile: any) => {
  if (rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/jpg' || rawFile.type === 'image/gif') {
    if (rawFile.size / 1024 / 1024 < 2) {
      return true
    } else {
      ElMessage.error('上传图片大小不能超过2MB!')
      return false
    }
  } else {
    ElMessage.error('上传图片只能是 JPG/PNG/JPEG/GIF 格式!')
    return false
  }
}
//对外暴露，使得父组件可以使用
defineExpose({
  initHasSpuData,
  initAddSpu
})
</script>

<style lang='scss' scoped></style>