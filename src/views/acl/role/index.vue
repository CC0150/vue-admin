<template>
  <el-card>
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input v-model="keyword" placeholder="请输入搜索职位"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="!keyword" type="primary" size="default" @click="search">搜索</el-button>
        <el-button type="info" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0;">
    <el-button type="primary" size="default" @click="addRole" icon="Plus">添加职位</el-button>
    <el-table v-loading="loading" element-loading-text="正在加载角色数据中" element-loading-spinner="Loading" border style="margin: 10px 0;" :data="allRoleList">
      <el-table-column type="index" align="center" label="#" width="80px"></el-table-column>
      <el-table-column prop="id" label="ID" align="center" width="150px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="roleName" label="职位名称" align="center" width="200"></el-table-column>
      <el-table-column width="200" align="center" label="创建时间">
        <template #default="{ row }">
          {{ new Date(row.createTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" width="200" align="center" label="更新时间">
        <template #default="{ row }">
          {{ new Date(row.updateTime).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="setPermission(row)" icon="User">分配权限</el-button>
          <el-button @click="updateRole(row)" type="warning" size="small" icon="Edit">编辑</el-button>
          <el-popconfirm title="确定删除吗?" @confirm="deleteRole(row)" confirmButtonText="确认" cancelButtonText="取消"
            icon="Delete" iconColor="red" width="180">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :total="total" background
      layout="prev, pager, next, jumper,->,total,sizes" @current-change="getAllRoleList" @size-change="handleSizeChange"
      :page-sizes="[5, 10, 20, 30]">
    </el-pagination>
  </el-card>
  <!-- 添加|更新职位对话框 -->
  <el-dialog v-model="dialogVisible" :title="roleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="roleParams" ref="formRef" :rules="rules">
      <el-form-item label="职位名称" prop="roleName">
        <el-input v-model="roleParams.roleName" placeholder="请输入职位名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 分配权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h3 style="font-size: 20px; font-weight: 600;">分配权限</h3>
    </template>
    <template #default>
      <el-tree ref="treeRef" :data="menuList" show-checkbox node-key="id" :default-expand-all="true"
        :default-checked-keys="checkedKeys" :props="defaultProps">
      </el-tree>
    </template>
    <template #footer>
      <div style="flex: auto;">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmPermission">
          确认
        </el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue';
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermisstion, reqRemoveRole } from '@/apis/acl/role';
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/apis/acl/role/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
let keyword = ref<string>('')
let allRoleList = ref<Records>([])
let dialogVisible = ref<boolean>(false)
let loading = ref<boolean>(false)
//新增职位数据
let roleParams = ref<RoleData>({
  roleName: '',
})
const formRef = ref<any>()
const drawer = ref<boolean>(false)
//存储用户权限
let menuList = ref<MenuList>([])
const defaultProps = {
  children: 'children',
  label: 'name'
}
//存储勾选的权限id(四级的)
let checkedKeys = ref<number[]>([])
//获取tree组件实例
const treeRef = ref<any>()
//分配权限
const setPermission = async (row: RoleData) => {
  drawer.value = true
  Object.assign(roleParams.value, row)
  //根据职位id获取权限列表
  const res: MenuResponseData = await reqAllMenuList(row.id as number)
  if (res.code == 200) {
    menuList.value = res.data
    checkedKeys.value = getCheckedKeys(menuList.value, [])
  }
}
const getCheckedKeys = (menuList: MenuList, keys: number[]) => {
  menuList.forEach(item => {
    if (item.select && item.level == 4) {
      keys.push(item.id as number)
    }
    if (item.children && item.children.length) {
      getCheckedKeys(item.children, keys)
    }
  })
  return keys
}
//确认分配权限
const confirmPermission = async () => {
  //职位id
  const roleId = roleParams.value.id
  //获取勾选的权限id
  const arr = treeRef.value.getCheckedKeys()
  //获取半选的权限id
  const halfCheckedKeys = treeRef.value.getHalfCheckedKeys()
  const permissionIds = [...arr, ...halfCheckedKeys]
  const res: any = await reqSetPermisstion(roleId as number, permissionIds)
  console.log(res);
  if (res.code == 200) {
    ElMessage.success('分配权限成功')
    drawer.value = false
    getAllRoleList()
  } else {
    ElMessage.error('分配权限失败')
  }
}
//删除职位
const deleteRole = async (row: RoleData) => {
  const res = await reqRemoveRole(row.id as number)
  if (res.code == 200) {
    ElMessage.success('删除成功')
    getAllRoleList(allRoleList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
//职位名称校验
const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('职位名称不能为空'))
  } else if (value.trim().length < 2 || value.trim().length > 10) {
    callback(new Error('职位名称长度在2-10之间'))
  } else {
    callback()
  }
}
//校验规则
const rules = ref<any>({
  roleName: [
    { required: true, trigger: 'blur', validator: validateRoleName },
  ],
})
//获取所有职位列表
const getAllRoleList = async (pager = 1) => {
  loading.value = true
  pageNo.value = pager
  try {
    const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    if (result.code == 200) {
      total.value = result.data.total
      allRoleList.value = result.data.records
    }
  } finally {
    loading.value = false
  }
}
//分页器每页条数改变
const handleSizeChange = () => {
  getAllRoleList()
}
//搜索职位
const search = () => {
  getAllRoleList()
}
//重置搜索
const reset = () => {
  keyword.value = ''
  getAllRoleList()
}
//添加|更新职位对话框确认按钮
const confirm = async () => {
  await formRef.value.validate()
  const res = await reqAddOrUpdateRole(roleParams.value)
  if (res.code == 200) {
    ElMessage.success(roleParams.value.id ? '更新成功' : '添加成功')
    dialogVisible.value = false
    getAllRoleList(roleParams.value.id ? pageNo.value : 1)
  } else {
    ElMessage.error(roleParams.value.id ? '更新失败' : '添加失败')
  }
}
//添加职位按钮
const addRole = () => {
  dialogVisible.value = true
  Object.assign(roleParams.value, {
    roleName: '',
    id: 0
  })
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//更新职位按钮
const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(roleParams.value, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//页面挂载时获取所有职位列表
onMounted(() => {
  getAllRoleList()
})
</script>

<style lang='scss' scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  height: 20px;
}
</style>