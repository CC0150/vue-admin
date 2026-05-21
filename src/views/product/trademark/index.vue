<template>
  <el-card>
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark" v-has="`btn.Trademark.add`">添加品牌</el-button>
    <el-table border style="margin: 10px 0;" :data="trademarkList">
      <el-table-column label="序号" width="100px" align="center" type="index"></el-table-column>
      <!-- table-column:默认展示数据用div -->
      <el-table-column label="品牌名称" align="center" prop="tmName"></el-table-column>
      <el-table-column label="品牌logo" align="center">
        <template #="{ row }">
          <el-image :src="row.logoUrl" style="width: 100px; height: 100px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{ row }">
          <el-button type="warning" size="small" icon="Edit" @click="editTrademark(row)">编辑</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteTrademark(row.id)" confirmButtonText="确认" cancelButtonText="取消"
            icon="Delete" iconColor="red">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[3, 5, 7, 9]"
      :pageCount="Math.ceil(total / pageSize)" :background="true" layout="prev, pager, next, jumper,->,total, sizes"
      :total="total" @current-change="getTrademarkList" @size-change="getTrademarkList(1)" />
  </el-card>
  <!-- 对话框 -->
  <el-dialog v-model="isShow" :title="trademarkParam.id ? '修改品牌' : '添加品牌'">
    <el-form style="width: 80%;" :model="trademarkParam" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="品牌名称" size="default" label-width="100px" prop="tmName">
        <el-input placeholder="请输入品牌名称" size="default" clearable v-model="trademarkParam.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌logo" size="default" label-width="100px" prop="logoUrl">
        <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :headers="headers"
          :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="trademarkParam.logoUrl" :src="trademarkParam.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="isShow = false">取消</el-button>
        <el-button type="primary" @click="confirm">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang='ts'>
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/apis/product/trademark';
import { nextTick, onMounted, reactive, ref } from 'vue';
import type { Records, TradeMarkResponseData, TradeMark } from '@/apis/product/trademark/type';
import { useUserStore } from '@/store/modules/user'
import type { UploadProps } from 'element-plus'
import { ElMessage } from 'element-plus'

// 获取用户相关的小仓库：获取仓库内部token，登录成功以后携带给服务器
const userStore = useUserStore()
const headers = { Token: userStore.token }

const pageNo = ref<number>(1);
const pageSize = ref<number>(3);
const total = ref<number>(0);

const isShow = ref<boolean>(false);

const trademarkParam = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
});

//获取form表单实例
const formRef = ref<any>(null);

//自定义校验规则
const validateTmName = (rule: any, value: any, callback: any) => {
  if (value.trim().length < 2 || value.trim().length > 10) {
    callback(new Error('品牌名称长度在 2 到 10 个字符'))
  } else {
    callback()
  }
}
const validateLogoUrl = (rule: any, value: any, callback: any) => {
  if (value) {
    callback()
  } else {
    callback(new Error('请上传品牌logo'))
  }
}
//表单校验
const rules = {
  tmName: [
    { required: true, trigger: 'blur', validator: validateTmName }
  ],
  logoUrl: [
    { required: true, validator: validateLogoUrl }
  ]
}

//上传图片前校验
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type === 'image/jpeg' || rawFile.type === 'image/png' || rawFile.type === 'image/gif') {
    const isLt2M = rawFile.size / 1024 / 1024 < 2
    if (!isLt2M) {
      ElMessage.error('上传图片大小不能超过 2MB!')
      return false
    }
    return true
  } else {
    ElMessage.error('上传图片只能是 JPG/PNG/GIF 格式!')
    return false
  }
}
//图片上传成功
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  trademarkParam.logoUrl = response.data
  formRef.value.validateField('logoUrl')
}

//添加品牌
const addTrademark = () => {
  trademarkParam.id = 0;
  nextTick(() => {
    formRef.value?.resetFields();
  })
  isShow.value = true;
}
//编辑品牌
const editTrademark = (row: TradeMark) => {
  nextTick(() => {
    formRef.value?.resetFields();
    Object.assign(trademarkParam, row);
  })
  isShow.value = true;
}

//删除品牌
const deleteTrademark = async (id: number) => {
  const res: any = await reqDeleteTrademark(id);
  if (res.code == 200) {
    ElMessage.success('删除成功');
    getTrademarkList(trademarkList.value.length > 1 ? pageNo.value : pageNo.value - 1);
  } else {
    ElMessage.error('删除失败');
  }
}

//确认
const confirm = async () => {
  //校验表单
  await formRef.value.validate();
  //发送请求
  const res: any = await reqAddOrUpdateTrademark(trademarkParam);
  if (res.code == 200) {
    ElMessage.success('操作成功');
    getTrademarkList(trademarkParam.id ? pageNo.value : 1);
    isShow.value = false;
  } else {
    ElMessage.error('操作失败');
    isShow.value = false;
  }
}

//存储已有品牌数据
const trademarkList = ref<Records>([]);

//获取品牌列表数据
const getTrademarkList = async (pager = 1) => {
  pageNo.value = pager;
  const res: TradeMarkResponseData = await reqHasTrademark(pageNo.value, pageSize.value)
  if (res.code == 200) {
    total.value = res.data.total;
    trademarkList.value = res.data.records;
  }
}

onMounted(() => {
  getTrademarkList();
})
</script>

<style scoped>
.btn {
  display: flex;
  justify-content: flex-end;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>