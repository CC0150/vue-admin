<template>
  <Category :scene="scene" />
  <el-card style="margin: 10px 0;">
    <div v-show="scene === 1">
      <el-button :disabled="!categoryStore.c3Id" type="primary" size="default" icon="Plus"
        @click="addAttr">添加属性</el-button>
      <el-table border style="margin: 10px 0;" :data="attrList">
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column label="属性名称" width="150" prop="attrName" align="center"></el-table-column>
        <el-table-column label="属性值列表" align="center">
          <template #="{ row }">
            <el-tag type="success" v-for="attrValue in row.attrValueList" :key="attrValue.id" style="margin: 0 5px;">{{
              attrValue.valueName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" prop="prop" align="center">
          <template #="{ row }">
            <el-button type="warning" size="small" icon="Edit" @click="updateAttr(row)">编辑</el-button>
            <el-popconfirm title="确定删除吗？" @confirm="deleteAttr(row.id)" confirmButtonText="确定" cancelButtonText="取消"
              icon="Delete" iconColor="red" width="200">
              <template #reference>
                <el-button type="danger" size="small" icon="Delete">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="scene === 2">
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input placeholder="请输入属性名称" v-model="attrValueList.attrName" size="default" />
        </el-form-item>
      </el-form>
      <el-button :disabled="!attrValueList.attrName" type="primary" size="default" icon="Plus"
        @click="addAttrValue">添加属性值</el-button>
      <el-button size="default" @click="cancle">取消</el-button>
      <el-table border style="margin: 10px 0;" :data="attrValueList.attrValueList">
        <el-table-column label="序号" width="80" type="index" align="center"></el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #="{ row, $index }">
            <el-input :ref="(vc: any) => inputRef[$index] = vc" v-if="row.flag" @blur="toLook(row, $index)"
              v-model="row.valueName" placeholder="请输入属性值名称" size="default" />
            <span v-else>{{ row.valueName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row, $index }">
            <el-button type="warning" size="small" icon="Edit" @click="toEdit(row, $index)">编辑</el-button>
            <el-button type="danger" size="small" icon="Delete" @click="deleteAttrValue($index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" size="default" @click="save"
        :disabled="attrValueList.attrValueList.length === 0">保存</el-button>
      <el-button size="default" @click="cancle">取消</el-button>
    </div>
  </el-card>

</template>

<script setup lang='ts'>
import { useCategoryStore } from '@/store/modules/category';
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/apis/product/attr';
import { reactive, watch, ref, nextTick, onBeforeUnmount } from 'vue';
import type { AttrResponseData, Attr, AttrValue } from '@/apis/product/attr/type';
import { ElMessage } from 'element-plus';

//存储组件实例el-input
const inputRef = ref<any>([])

const categoryStore = useCategoryStore()
//收集新增属性值的数据
const attrValueList = reactive<Attr>({
  attrName: '',//新增的属性名
  attrValueList: [],//新增的属性值列表
  categoryId: '',//三级分类id
  categoryLevel: 3,//代表三级分类
})
//添加属性值
const addAttrValue = () => {
  attrValueList.attrValueList.push({
    attrId: attrValueList.id!,//新增的属性值属于哪个属性
    valueName: '',//新增的属性值
    flag: true,//控制属性值列表的编辑状态
  })
  //自动获取焦点
  nextTick(() => {
    inputRef.value[attrValueList.attrValueList.length - 1].focus()
  })
}
//删除属性值
const deleteAttrValue = (index: number) => {
  attrValueList.attrValueList.splice(index, 1)
}
//保存属性
const save = async () => {
  const res = await reqAddOrUpdateAttr(attrValueList)
  if (res.code === 200) {
    scene.value = 1
    ElMessage.success(attrValueList.id ? '修改成功' : '添加成功')
    getAttr()
  } else {
    ElMessage.error(attrValueList.id ? '修改失败' : '添加失败')
  }
}
//删除属性
const deleteAttr = async (id: number) => {
  const res = await reqRemoveAttr(id)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getAttr()
  } else {
    ElMessage.error('删除失败')
  }
}
//存储属性列表数据
const attrList = reactive<Attr[]>([])
//控制card组件内容的切换
const scene = ref<number>(1)
//点击添加属性按钮，切换card组件内容
const addAttr = () => {
  //清空上一次的属性值列表数据
  Object.assign(attrValueList, {
    attrName: '',//新增的属性名
    attrValueList: [],//新增的属性值列表
    categoryId: categoryStore.c3Id,//三级分类id
    categoryLevel: 3,//代表三级分类
  })
  scene.value = 2
}
//点击属性值列表的查看按钮，切换属性值列表的编辑状态
const toLook = (row: AttrValue, index: number) => {
  if (row.valueName.trim() === '') {
    //删除属性值列表中的空属性值
    attrValueList.attrValueList.splice(index, 1)
    ElMessage.error('属性值不能为空')
    return
  }
  const repeat = attrValueList.attrValueList.find((item) => {
    //把当前失去焦点的属性值排除在外
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })
  if (repeat) {
    //删除属性值列表中的重复属性值
    attrValueList.attrValueList.splice(index, 1)
    ElMessage.error('属性值不能重复')
    return
  }
  row.flag = false
}
//点击属性值列表的编辑按钮，切换属性值列表的编辑状态
const toEdit = (row: AttrValue, index: number) => {
  row.flag = true
  nextTick(() => {
    inputRef.value[index].focus()
  })
}
//点击编辑按钮，切换card组件内容
const updateAttr = (row: Attr) => {
  scene.value = 2
  //将row对象中的数据赋值给attrValueList对象,使用深拷贝
  Object.assign(attrValueList, JSON.parse(JSON.stringify(row)))
}
const cancle = () => {
  scene.value = 1
}

//监听三级分类id的变化，获取属性列表
watch(() => categoryStore.c3Id, async () => {
  attrList.length = 0 //清空上一次的查询结果
  if (categoryStore.c3Id) {
    getAttr()
  }
})

const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  const res: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (res.code === 200) {
    attrList.splice(0, attrList.length, ...res.data)
  }
}

//路由组件销毁时，把仓库分类相关的数据清空
onBeforeUnmount(() => {
  categoryStore.clearCategory()
})

</script>

<style lang='scss' scoped></style>