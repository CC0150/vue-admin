import axios from "axios";
import { ElMessage } from 'element-plus'
import { useUserStore } from "@/store/modules/user";
import router from "@/router";

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use(config => {
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
}, error => {
  return Promise.reject(error)
}
)

// 响应拦截器
request.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  //处理网络错误
  let msg = '';
  const status = error.response?.status;
  switch (status) {
    case 401: {
      msg = "token过期，请重新登录";
      const userStore = useUserStore();
      userStore.forceLogout();
      const fullPath = router.currentRoute.value.fullPath;
      router.push({
        path: "/login",
        query: fullPath === "/login" ? undefined : { redirect: fullPath },
      });
      break;
    }
    case 403:
      msg = '无权访问';
      break;
    case 404:
      msg = "请求地址错误";
      break;
    case 500:
      msg = "服务器出现问题";
      break;
    default:
      msg = "无网络";
  }
  if (msg) {
    ElMessage({ type: 'error', message: msg });
  }
  return Promise.reject(error);
});

export default request