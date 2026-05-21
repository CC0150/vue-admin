//封装本地存储存储数据与读取数据方法
//存储token
export const SET_TOKEN = (token: string) => {
  localStorage.setItem("TOKEN", token);
}
//本地存储获取token
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN');
}
//本地存储删除token
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN');
}

//存储记住的登录凭据
export const SET_REMEMBERED_CREDENTIALS = (credentials: { username: string; password: string }) => {
  localStorage.setItem('REMEMBERED_CREDENTIALS', JSON.stringify(credentials));
}

//获取记住的登录凭据
export const GET_REMEMBERED_CREDENTIALS = () => {
  const credentials = localStorage.getItem('REMEMBERED_CREDENTIALS');
  if (credentials) {
    try {
      return JSON.parse(credentials);
    } catch (error) {
      console.error('解析记住的凭据失败:', error);
      // 清除损坏的数据
      localStorage.removeItem('REMEMBERED_CREDENTIALS');
      return null;
    }
  }
  return null;
}

//删除记住的登录凭据
export const REMOVE_REMEMBERED_CREDENTIALS = () => {
  localStorage.removeItem('REMEMBERED_CREDENTIALS');
}