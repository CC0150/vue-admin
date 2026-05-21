# 智管后台管理系统

基于 Vue 3 + TypeScript + Vite + Element Plus + Pinia + ECharts 构建的中后台管理系统 SPA。

## 技术栈

| 类别         | 技术                              |
| ------------ | --------------------------------- |
| 框架         | Vue 3.5 + Composition API         |
| 语言         | TypeScript 5.8                    |
| 构建工具     | Vite 7                            |
| UI 组件库    | Element Plus 2.11                 |
| 状态管理     | Pinia 2.1 + 持久化插件             |
| 路由         | Vue Router 4.5                    |
| HTTP 客户端  | Axios 1.12                        |
| 图表         | ECharts 5 + liquidfill            |
| CSS 预处理   | Sass                              |
| Mock         | vite-plugin-mock + mockjs         |

## 功能模块

- **首页** — 统计概览仪表盘
- **权限管理** — 用户管理 / 角色管理 / 菜单管理（路由级 + 按钮级权限控制）
- **商品管理** — 品牌管理 / 属性管理 / SPU 管理 / SKU 管理
- **数据大屏** — ECharts 可视化大屏，含地图、趋势图、排名等组件

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（Mock API，自动打开浏览器）
npm run dev

# 类型检查 + 测试环境构建
npm run build:test

# 类型检查 + 生产环境构建
npm run build:pro

# 本地预览生产构建
npm run preview
```

## 目录结构

```
├── mock/                    # Mock API 数据
├── public/                  # 静态资源
├── src/
│   ├── apis/                # API 接口层（按模块划分）
│   │   ├── acl/             #   权限管理 API
│   │   ├── product/         #   商品管理 API
│   │   └── user/            #   用户 API
│   ├── assets/              # 静态图片资源
│   ├── components/          # 公共组件
│   ├── directive/           # 自定义指令（v-has 权限指令）
│   ├── layout/              # 布局组件（侧边栏/顶栏/Logo）
│   ├── router/              # 路由配置
│   ├── store/               # Pinia 状态管理
│   │   └── modules/         #   user / setting / category
│   ├── style/               # 全局样式与 SCSS 变量
│   ├── utils/               # 工具函数（request / token）
│   ├── views/               # 页面视图
│   │   ├── acl/             #   权限管理页面
│   │   ├── product/         #   商品管理页面
│   │   ├── home/            #   首页
│   │   ├── login/           #   登录页
│   │   ├── screen/          #   数据大屏
│   │   └── 404/             #   404 页面
│   ├── App.vue
│   ├── main.ts              # 入口文件
│   ├── permission.ts        # 路由守卫
│   └── setting.ts           # 全局设置
├── .env.development         # 开发环境变量
├── .env.production          # 生产环境变量
├── vite.config.ts           # Vite 配置
└── tsconfig.json            # TypeScript 配置
```

## 权限模型

- **路由级权限**：后端返回允许的路由名称列表，前端通过 `filterAsyncRoutes()` 动态注册匹配的路由
- **按钮级权限**：后端返回 `buttons` 数组，通过 `v-has` 自定义指令控制按钮显隐

## 环境变量

| 变量名             | 说明          | 开发环境默认值           |
| ------------------ | ------------- | ------------------------ |
| VITE_APP_TITLE     | 应用标题      | 通用后台管理系统         |
| VITE_APP_BASE_API  | API 前缀      | /api                     |
| VITE_SERVE         | 后端 API 地址 | http://127.0.0.1:10086   |
