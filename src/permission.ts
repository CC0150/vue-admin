//路由鉴权
import router from "./router";
import nprogress from "nprogress";
import "nprogress/nprogress.css";
import { useUserStore } from "./store/modules/user";
import pinia from "./store";
import setting from "./setting";
import { ElMessage } from "element-plus";

nprogress.configure({
  showSpinner: false, //是否显示环形进度条
});
const userStore = useUserStore(pinia);
//全局前置路由守卫
router.beforeEach(async (to, from) => {
  document.title = `${setting.title} - ${to.meta.title}`;

  nprogress.start();

  //获取token
  let token = userStore.token;

  //获取用户名字
  const username = userStore.username;

  //判断是否登录
  if (token) {
    if (to.path === "/login") {
      //已登录，跳转到首页
      return { path: "/" };
    } else {
      if (username) {
        return true;
      } else {
        try {
          await userStore.getUserInfo();
          return { ...to };
        } catch (error) {
          //token失效，清除token并跳转到登录页，登录后可跳回当前页
          userStore.forceLogout();
          ElMessage.error("token已过期，请重新登录");
          return {
            path: "/login",
            query: { redirect: to.fullPath },
          };
        }
      }
    }
  } else {
    //未登录
    if (to.path === "/login") {
      return true;
    } else {
      return {
        path: "/login",
        query: { redirect: to.fullPath },
      };
    }
  }
});

//全局后置路由守卫
router.afterEach((to, from) => {
  nprogress.done();
});
