//封装获取当前时间的函数，判断当前是上午还是下午，还是晚上
export function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours();
  let message = '';
  if (hours >= 6 && hours < 12) {
    message = '上午';
  } else if (hours >= 12 && hours < 18) {
    message = '下午';
  } else {
    message = '晚上';
  }
  return message;
}