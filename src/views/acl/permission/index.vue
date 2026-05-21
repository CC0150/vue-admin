<template>
  <el-card>
    <el-table v-loading="loading" element-loading-text="正在加载菜单数据中" element-loading-spinner="Loading" border
      style="margin: 10px 0" :data="permissionList" row-key="id">
      <el-table-column label="权限名称" prop="name" align="center" />
      <el-table-column label="权限值" prop="code" align="center" />
      <el-table-column label="修改时间" prop="updateTime" align="center" />
      <el-table-column label="操作" align="center">
        <template #default="{ row }">
          <el-button @click="addPermission(row)" type="primary" size="small" icon="Plus" :disabled="row.level === 4">{{
            row.level === 3 ? '添加功能' :
              '添加菜单' }}</el-button>
          <el-button @click="updatePermission(row)" type="warning" size="small" icon="Edit"
            :disabled="row.level === 1">修改</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deletePermission(row)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete" :disabled="row.level === 1">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!-- 对话框组件 -->
  <el-dialog v-model="dialogVisible" :title="menuParams.id ? '修改菜单' : '添加菜单'" width="30%">
    <el-form label-width="80px">
      <el-form-item label="权限名称">
        <el-input placeholder="请输入权限名称" v-model="menuParams.name" />
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请输入权限值" v-model="menuParams.code" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/apis/acl/menu';
import type { PermisstionList, PermisstionResponseData, Permisstion, MenuParams } from '@/apis/acl/menu/type';
import { ElMessage } from 'element-plus';

//存储权限列表
const permissionList = ref<PermisstionList>([]);
//控制对话框显示
const dialogVisible = ref<boolean>(false);
//loading状态
const loading = ref<boolean>(false);
//携带的参数
const menuParams = ref<MenuParams>({
  code: '',
  level: 0,
  name: '',
  pid: 0
});
//添加权限
const addPermission = (row: Permisstion) => {
  Object.assign(menuParams.value, {
    code: '',
    level: 0,
    name: '',
    pid: 0
  })
  dialogVisible.value = true;
  menuParams.value.level = row.level + 1;
  menuParams.value.pid = row.id!
};
//修改权限
const updatePermission = (row: Permisstion) => {
  dialogVisible.value = true;
  Object.assign(menuParams.value, row);
};
//删除权限
const deletePermission = async (row: Permisstion) => {
  const res = await reqRemoveMenu(row.id!);
  if (res.code === 200) {
    ElMessage.success('删除成功');
    getPermisstionList();
  } else {
    ElMessage.error('删除失败');
  }
}
//保存权限
const save = async () => {
  const res = await reqAddOrUpdateMenu(menuParams.value);
  if (res.code === 200) {
    dialogVisible.value = false;
    ElMessage.success(menuParams.value.id ? '修改成功' : '添加成功');
    getPermisstionList();
  } else {
    ElMessage.error(menuParams.value.id ? '修改失败' : '添加失败');
  }
}
//获取权限列表
const getPermisstionList = async () => {
  loading.value = true
  try {
    const result: PermisstionResponseData = await reqAllPermisstion();
    console.log(result);
    if (result.code === 200) {
      permissionList.value = result.data;
    }
  } finally {
    loading.value = false
  }
};

onMounted(() => {
  getPermisstionList();
})
</script>

<style lang='scss' scoped></style>