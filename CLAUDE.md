# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

```
npm run dev          # 启动开发服务器（自动打开浏览器）
npm run build:test   # 类型检查 + 构建（测试模式，保留 console）
npm run build:pro    # 类型检查 + 构建（生产模式，移除 console/debugger）
npm run preview      # 本地预览生产构建
```

项目中未配置 lint、格式化或测试命令。

## 项目架构

这是一个 Vue 3 中后台管理系统 SPA（智管后台管理系统），技术栈为 TypeScript + Vite + Element Plus + Pinia + ECharts。

### 路径别名

`@` 映射到 `./src`（在 `vite.config.ts` 中配置）。`src/style/variables.scss` 中的 SCSS 变量会自动注入到每个组件的 `<style>` 块中。

### 认证与路由

1. `src/permission.ts` 是路由守卫。每次导航时会检查 Pinia 中的 `userStore.token`（通过 localStorage 持久化）。
2. 如果 token 存在但 `username` 尚未加载，则调用 `userStore.getUserInfo()` — 该方法会请求用户详情以及后端返回的 `routes` 数组。
3. 后端返回允许的路由名称列表。通过 `filterAsyncRoutes()` 与 `src/router/routes.ts` 中的 `asyncRoute` 进行匹配，然后通过 `router.addRoute()` 动态注册。这意味着**路由由后端控制** — 前端有静态路由定义，但只有后端授权的路由才会被注册。
4. 未登录用户会被重定向到 `/login`，并携带 `?redirect=` 查询参数。收到 401 响应时，`forceLogout()` 会清除 token 并跳转到登录页。
5. 路由守卫中集成了 `nprogress` 页面加载进度条（`beforeEach` 启动，`afterEach` 结束）。
6. 路由 `meta.keepAlive: true` 的页面会被 `<keep-alive>` 缓存，避免重复渲染。

### 权限模型

- 路由级权限：后端返回 `routes` 字符串数组（匹配路由的 `name` 值），控制用户可以访问的菜单项和页面。
- 按钮级权限：后端同时返回 `buttons` 字符串数组。自定义指令 `v-has`（`src/directive/has.ts`）会移除 DOM 中绑定值不在用户按钮数组中的元素。

### 状态管理（Pinia）

- `user` store（`src/store/modules/user.ts`）：token、用户名、头像、菜单路由、按钮权限、登录凭据及"记住我"功能。
- `setting` store：侧边栏折叠状态、页面刷新开关、暗黑模式。
- `category` store：三级级联分类数据。
- 所有 store 通过 `pinia-plugin-persistedstate` 实现 localStorage 持久化。

### API 层

- `src/utils/request.ts` 创建 Axios 实例，`baseURL` 取自环境变量 `VITE_APP_BASE_API`，超时 5 秒。
- 请求拦截器从 user store 中获取 token 并设置到 `config.headers.token`。
- 响应拦截器解包 `response.data` 并处理 HTTP 错误（401 → 强制登出，403/404/500 → 提示错误消息）。
- API 模块按 `src/apis/<功能模块>/<资源>/index.ts` 组织，对应的类型定义在 `type.ts` 文件中。

### 布局

- 侧边栏 Menu 组件（`src/layout/menu/index.vue`）是**递归组件**，自身渲染 `<Menu :menuList="item.children" />`，支持无限级嵌套路由菜单。
- `main.ts` 中通过 `for...of Object.entries(ElementPlusIconsVue)` 全局注册了所有 Element Plus 图标，组件中可直接用 `<component :is="图标名" />` 使用而不必导入。

### 入口初始化顺序

`src/main.ts` 中 `import './permission'` 必须在 `createApp` 之前执行，因为权限守卫中用到了 `useUserStore(pinia)`，pinia 实例需要先于路由守卫创建。顺序不可随意调整。

### 全局配置

`src/setting.ts` 集中管理项目标题和 logo 配置，被 `permission.ts`（动态设置 `document.title`）和 layout 组件引用。

### 自动导入

- `unplugin-auto-import` 自动导入 Element Plus API（无需手动导入 `ElMessage` 等）。
- `unplugin-vue-components` 自动全局注册 Element Plus 组件。
- `components.d.ts` 和 `auto-imports.d.ts` 是自动生成的，不要手动编辑。

### 开发代理

- 开发模式下，匹配 `/api` 的请求会被代理到 `VITE_SERVE` 指定的后端地址（默认 `http://127.0.0.1:10086`，可通过 `.env.development` 配置）。

### 构建

- 使用 `esbuild` 压缩，目标 ES2015。
- ECharts/zrender 会被提取到单独的 `echarts` chunk 中。
- 生产模式下会移除 `console` 和 `debugger` 语句。
- 运行 `npm run build:test` 或 `npm run build:pro` — 两者都会在 Vite 构建之前先执行 `vue-tsc` 类型检查。
