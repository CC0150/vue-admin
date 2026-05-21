import { defineStore } from "pinia";
import { reqLogin, reqUserInfo, reqLogout } from "@/apis/user";
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from "@/apis/user/type";
import { ref, shallowRef } from "vue";
import { constantRoutes, asyncRoute, anyRoute } from "@/router/routes";
import type { RouteRecordRaw } from "vue-router";
import router from "@/router";
//引入深拷贝方法
import cloneDeep from "lodash/cloneDeep";
import {
  SET_TOKEN,
  GET_TOKEN,
  REMOVE_TOKEN,
  SET_REMEMBERED_CREDENTIALS,
  GET_REMEMBERED_CREDENTIALS,
  REMOVE_REMEMBERED_CREDENTIALS,
} from "@/utils/token";

//用于过滤当前用户需要展示的异步路由
const filterAsyncRoutes = (asyncRoutes: RouteRecordRaw[], routes: string[]) => {
  return asyncRoutes.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
};

export const useUserStore = defineStore("user", () => {
  let token = ref<string>(GET_TOKEN() || "");
  // 菜单路由
  let menuRoutes = shallowRef<RouteRecordRaw[]>(constantRoutes);
  // 记住密码状态
  let rememberMe = ref<boolean>(false);
  // 登录表单数据
  let loginFormData = ref<loginFormData>({
    username: "",
    password: "",
  });

  // 登录
  const userLogin = async (data: loginFormData) => {
    const res: loginResponseData = await reqLogin(data);
    if (res.code === 200) {
      // 存储token
      token.value = res.data;
      SET_TOKEN(res.data);

      // 保存登录表单数据
      loginFormData.value = { ...data };

      // 记住密码处理
      if (rememberMe.value) {
        SET_REMEMBERED_CREDENTIALS(data);
      } else {
        REMOVE_REMEMBERED_CREDENTIALS();
      }

      return "ok";
    } else {
      return Promise.reject(new Error(res.data));
    }
  };

  // 设置记住密码状态
  const setRememberMe = (value: boolean) => {
    rememberMe.value = value;
  };

  // 加载记住的凭据
  const loadRememberedCredentials = () => {
    const credentials = GET_REMEMBERED_CREDENTIALS();
    if (credentials) {
      loginFormData.value = { ...credentials };
      rememberMe.value = true;
      return true;
    }
    return false;
  };

  let username = ref<string>("");
  let avatar = ref<string>("");
  let buttons = ref<string[]>([]);

  //获取用户信息
  const getUserInfo = async () => {
    const res: userInfoResponseData = await reqUserInfo();
    console.log(res.data);
    if (res.code === 200) {
      username.value = res.data.name;
      avatar.value = res.data.avatar;
      buttons.value = res.data.buttons;
      // 过滤异步路由
      const userAsyncRoutes = filterAsyncRoutes(
        cloneDeep(asyncRoute), //深拷贝异步路由，避免直接修改原始路由
        res.data.routes,
      );
      // 更新菜单路由-用于展示用户菜单
      menuRoutes.value = [...constantRoutes, ...userAsyncRoutes, ...anyRoute];
      // 添加新路由-实现真正的路由访问
      const allRoutes = [...userAsyncRoutes, anyRoute];
      allRoutes.forEach((route: any) => {
        router.addRoute(route);
      });
      return "ok";
    } else {
      return Promise.reject(new Error(res.message));
    }
  };

  //退出登录
  const logout = async () => {
    let res = await reqLogout();
    if (res.code === 200) {
      token.value = "";
      username.value = "";
      avatar.value = "";
      REMOVE_TOKEN();
      // 不清除记住的凭据，因为用户可能希望下次登录时仍能自动填充
      return "ok";
    } else {
      return Promise.reject(new Error(res.message));
    }
  };

  // 仅清除本地 token 和用户信息（如 401 时使用，不请求后端）
  const forceLogout = () => {
    token.value = "";
    username.value = "";
    avatar.value = "";
    REMOVE_TOKEN();
  };

  return {
    userLogin,
    token,
    menuRoutes,
    getUserInfo,
    username,
    avatar,
    buttons,
    logout,
    forceLogout,
    rememberMe,
    loginFormData,
    setRememberMe,
    loadRememberedCredentials,
  };
});
