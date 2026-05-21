import pinia from "@/store"
import { useUserStore } from "@/store/modules/user"

export const isHasButton = (app: any) => {
  const userStore = useUserStore(pinia)
  //全局自定义指令：实现按钮的权限
  app.directive('has', {
    // 当被绑定的元素挂载到 DOM 上时执行
    mounted(el: any, binding: any) {
      if (!userStore.buttons.includes(binding.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}