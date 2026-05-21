<template>
  <el-card style="height: 75px;">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名">
        <el-input v-model="keyword" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="!keyword" type="primary" size="default" @click="search">查询</el-button>
        <el-button type="info" size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px">
    <el-button type="primary" size="default" @click="addUser">添加用户</el-button>
    <el-button :disabled="!selectIdList.length" type="danger" size="default"
      @click="deleteSelectedUser">批量删除</el-button>
    <el-table @selection-change="handleSelectionChange" v-loading="loading" element-loading-text="正在加载用户数据中"
      element-loading-spinner="Loading" border style="margin: 10px" :data="userList">
      <el-table-column align="center" type="selection" width="80"></el-table-column>
      <el-table-column width="100" align="center" label="#" type=index></el-table-column>
      <el-table-column show-overflow-tooltip prop="id" width="100" align="center" label="ID"></el-table-column>
      <el-table-column show-overflow-tooltip prop="username" width="200" align="center" label="用户名称"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" width="200" align="center" label="用户姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="roleName" width="200" align="center" label="用户角色"></el-table-column>
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
      <el-table-column width="300" fixed="right" align="center" label="操作">
        <template #default="{ row }">
          <el-button @click="assignRole(row)" type="primary" size="small" icon="User">分配角色</el-button>
          <el-button type="warning" size="small" icon="Edit" @click="EditUser(row)">修改</el-button>
          <el-popconfirm title="你确定要删除吗?" @confirm="deleteUser(row.id)" confirmButtonText="确定" cancelButtonText="取消">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :total="total" background
      layout="prev, pager, next, jumper,->,total,sizes" @current-change="getUserInfo" @size-change="handler"
      :page-sizes="[5, 10, 20, 30]">
    </el-pagination>
  </el-card>
  <!-- 抽屉效果————添加|修改用户 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h3 style="font-weight: 600;font-size: 20px;">{{ userParams.id ? '修改用户' : '添加用户' }}</h3>
    </template>
    <template #default>
      <el-form ref="formRef" :model="userParams" :rules="rules" label-width="100px">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="userParams.username" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="用户昵称">
          <el-input v-model="userParams.name" placeholder="请输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" prop="password" label="用户密码">
          <el-input v-model="userParams.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="info" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-drawer>
  <!-- 抽屉效果————分配角色 -->
  <el-drawer v-model="drawer1">
    <template #header>
      <h3 style="font-weight: 600;font-size: 20px;">分配角色</h3>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
            @change="handleCheckAllChange">全选</el-checkbox>
          <el-checkbox-group v-model="userRoleList" @change="handleCheckedChange">
            <el-checkbox v-for="(item, index) in allRoleList" :key="index" :label="item">{{ item.roleName
            }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button type="info" size="default" @click="drawer1 = false">取消</el-button>
      <el-button type="primary" size="default" @click="saveRole">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang='ts'>
import { nextTick, onMounted, ref } from 'vue';
import { reqUserInfo, reqRemoveUser, reqSelectUser, reqAddOrUpdateUser, reqAllRole, reqSetUserRole } from '@/apis/acl/user';
import type { UserResponseData, Records, User, AllRole, AllRoleResponseData, SetRoleData } from '@/apis/acl/user/type';
import { ElMessage } from 'element-plus';

let pageNo = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
let userList = ref<Records>([])
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
let loading = ref<boolean>(false)
let keyword = ref<string>('')
let userParams = ref<User>({
  username: '',
  name: '',
  password: '',
})
//全部职位列表
const allRoleList = ref<AllRole>([])
//当前用户已有的角色
const userRoleList = ref<AllRole>([])
//存储批量删除选中的用户的id
const selectIdList = ref<User[]>([])
//获取表单实例
const formRef = ref<any>()
// 验证用户名
const validateUsername = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户名'))
  } else if (value.trim().length < 3 || value.trim().length > 10) {
    callback(new Error('用户名长度在3到10之间'))
  } else {
    callback()
  }
}
//验证姓名
const validateName = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户昵称'))
  } else if (value.trim().length < 3 || value.trim().length > 10) {
    callback(new Error('用户昵称长度在3到10之间'))
  } else {
    callback()
  }
}
// 验证密码
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入用户密码'))
  } else if (value.trim().length < 6 || value.trim().length > 10) {
    callback(new Error('用户密码长度在6到10之间'))
  } else {
    callback()
  }
}
// 验证规则
const rules = ref<any>({
  username: [
    { required: true, trigger: 'blur', validator: validateUsername },
  ],
  name: [
    { required: true, trigger: 'blur', validator: validateName },
  ],
  password: [
    { required: true, trigger: 'blur', validator: validatePassword },
  ],
})
// 保存用户信息
const save = async () => {
  // 验证表单
  await formRef.value.validate()
  const res: any = await reqAddOrUpdateUser(userParams.value)
  console.log(res)
  if (res.code === 200) {
    drawer.value = false
    ElMessage.success(userParams.value.id ? '修改成功' : '添加成功')
    // getUserInfo(userParams.value.id ? pageNo.value : 1)
    //浏览器自动刷新
    window.location.reload()
  } else {
    drawer.value = false
    ElMessage.error(userParams.value.id ? '修改失败' : '添加失败')
  }
}
// 取消
const cancel = () => {
  drawer.value = false
}
// 获取用户信息
const getUserInfo = async (pager = 1) => {
  loading.value = true
  pageNo.value = pager
  try {
    const res: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
    if (res.code === 200) {
      userList.value = res.data.records
      total.value = res.data.total
    }
  } catch (error) {
    // console.log(error)
    ElMessage.error('获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const handler = () => {
  getUserInfo()
}
// 添加用户
const addUser = () => {
  drawer.value = true
  Object.assign(userParams.value, {
    id: 0,
    username: '',
    name: '',
    password: '',
  })
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
// 修改用户
const EditUser = (row: User) => {
  drawer.value = true
  Object.assign(userParams.value, row)
  nextTick(() => {
    formRef.value.clearValidate()
  })
}
//删除单个用户
const deleteUser = async (userId: number) => {
  const res: any = await reqRemoveUser(userId)
  console.log(res)
  if (res.code === 200) {
    ElMessage.success('删除成功')
    getUserInfo(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('删除失败')
  }
}
//table复选框选中状态改变时触发
const handleSelectionChange = (value: User[]) => {
  selectIdList.value = value
}
//批量删除用户
const deleteSelectedUser = async () => {
  let ids: number[] = selectIdList.value.map((item) => item.id!)
  const res: any = await reqSelectUser(ids)
  if (res.code === 200) {
    ElMessage.success('批量删除成功')
    getUserInfo(userList.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage.error('批量删除失败')
  }
}
//分配角色
const assignRole = async (row: User) => {
  Object.assign(userParams.value, row)
  const res: AllRoleResponseData = await reqAllRole(userParams.value.id!)
  if (res.code === 200) {
    allRoleList.value = res.data.allRolesList
    userRoleList.value = res.data.assignRoles
    drawer1.value = true
  }
}
//收集全选框的数据
let checkAll = ref<boolean>(false)
//控制全选框不确定样式
const isIndeterminate = ref<boolean>(true)
//全选框选中状态改变时触发
const handleCheckAllChange = (val: boolean) => {
  userRoleList.value = val ? allRoleList.value : []
  isIndeterminate.value = false
}
//底部复选框选中状态改变时触发
const handleCheckedChange = (value: string[]) => {
  const checkedCount = value.length//选中的个数
  checkAll.value = checkedCount === allRoleList.value.length
  isIndeterminate.value = checkedCount > 0 && checkedCount < allRoleList.value.length
}
//保存角色
const saveRole = async () => {
  let data: SetRoleData = {
    userId: userParams.value.id!,
    roleIdList: userRoleList.value.map((item) => item.id!),
  }
  const res: any = await reqSetUserRole(data)
  if (res.code === 200) {
    drawer1.value = false
    ElMessage.success('分配角色成功')
    getUserInfo(pageNo.value)
  } else {
    ElMessage.error('分配角色失败')
  }
}
//查询
const search = () => {
  getUserInfo()
}
//重置
const reset = () => {
  keyword.value = ''
  getUserInfo()
}

onMounted(() => {
  getUserInfo()
})
</script>

<style lang='scss' scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>