<template>
  <div class="header">
    <div class="left">
      <el-icon style="margin: 0 10px;padding-top: 2px;" @click="changeIcon">
        <component :is="isFold ? 'Expand' : 'Fold'" />
      </el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in route.matched" :to="item.path" :key="index"
          v-show="item.meta.title">
          <el-icon style="margin: 0 5px;" v-if="item.meta.icon">
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <el-button size="small" icon="Refresh" circle @click="handlerRefresh" />
      <el-button size="small" icon="FullScreen" circle @click="handlerFullScreen" />
      <el-popover placement="bottom" title="主题设置" :width="200" trigger="hover">
        <el-form>
          <el-form-item label="主题颜色">
            <el-color-picker :teleported="false" @change="setColor" v-model="color" show-alpha
              :predefine="predefineColors" size="small" />
          </el-form-item>
          <el-form-item label="暗黑模式">
            <el-switch @change="changeDark" class="mt-2" inline-prompt v-model="dark" size="small" active-icon="Moon"
              inactive-icon="Sunny" />
          </el-form-item>
        </el-form>
        <template #reference>
          <el-button size="small" icon="Setting" circle />
        </template>
      </el-popover>

      <el-avatar style="width: 24px; height: 24px; margin: 0 10px;" :src="avatar || defaultAvatar" />
      <el-dropdown style="margin-right: 10px;">
        <span class="el-dropdown-link">
          {{ username }}
          <el-icon class="el-icon--right">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang='ts' name="Header">
import { useSettingStore } from '@/store/modules/setting';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const route = useRoute()
const { isFold, refresh, dark } = storeToRefs(useSettingStore())
const { avatar, username } = storeToRefs(useUserStore())
const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
//设置主题颜色
const setColor = () => {
  document.documentElement.style.setProperty('--el-color-primary', color.value)
}
//切换主题
const changeDark = () => {
  //获取HTML根节点
  const html = document.documentElement
  //判断是否为暗黑模式
  dark.value ? html.className = 'dark' : html.className = ''
}

const changeIcon = () => {
  isFold.value = !isFold.value
}

const handlerRefresh = () => {
  refresh.value = !refresh.value
}

const handlerFullScreen = () => {
  //判断是否全屏
  if (!document.fullscreenElement) {
    // 实现全屏
    document.documentElement.requestFullscreen()
  } else {
    //退出全屏
    document.exitFullscreen()
  }
}

const router = useRouter()
const userStore = useUserStore()
const logout = async () => {
  await userStore.logout()
  router.push({
    path: '/login',
    query: {
      redirect: route.path
    }
  })
}
</script>

<style lang='scss' scoped>
.header {
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;

  .left {
    display: flex;
    align-items: center;
  }

  .right {
    display: flex;
    align-items: center;

    .el-dropdown-link {
      cursor: pointer;
      color: var(--el-color-primary)
    }
  }
}
</style>