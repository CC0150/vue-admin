import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

import ElementPlus from "unplugin-element-plus/vite";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  //获取各种环境下的环境变量
  const env = loadEnv(mode, process.cwd());
  //判断是否为生产环境
  const isProduction = mode === "production";

  return {
    plugins: [
      // 打包体积分析 - 生成可视化报告帮助优化构建性能
      visualizer({
        open: true,
        filename: "visualizer.html",
      }),
      vue(),


      // Element Plus API 自动导入插件
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),

      // Vue 组件自动注册插件
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver(),
        ],
      }),

      // Element Plus Vite 插件
      ElementPlus({}),
    ],

    // 路径别名配置
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // CSS 预处理器配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/style/variables.scss";',
        },
      },
    },

    //配置代理 - 开发环境跨域解决方案
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //是否开启代理跨域
          changeOrigin: true,
          //重写路径
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    // 构建配置
    build: {
      minify: "esbuild",
      target: "es2015",
      rollupOptions: {
        output: {
          //最小化拆分包 - 提高加载性能
          manualChunks(id) {
            // 保留echarts的单独拆分 - 减小主包体积
            if (id.includes("echarts") || id.includes("zrender")) {
              return "echarts";
            }

            // 其他第三方依赖按包名拆分
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
    },

    // ESBuild 配置 - Vite 默认使用的构建工具
    esbuild: {
      //生产环境中去除console和debugger压缩代码体积
      drop: isProduction ? ["console", "debugger"] : [],
    },
  };
});
