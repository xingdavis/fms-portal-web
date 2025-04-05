const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_BASE_URL, // 目标服务器地址
        changeOrigin: true, // 是否允许跨域
        pathRewrite: { "^/api": "" }, // 重写路径
      },
    },
    client: {
      overlay: {
        runtimeErrors: false, // 禁用运行时错误覆盖层
      },
    },
  },
});
