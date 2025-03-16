// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

// 导入视图组件
import Home from "../views/HomeView.vue";
import FreightRateList from "../views/FreightRateList.vue";
import Workspace from "../views/WorkspaceView.vue";
import News from "../views/NewsView.vue";
import Register from "../views/RegisterView.vue";

// 定义路由
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/freightRateList",
    name: "FreightRateList",
    component: FreightRateList,
  },
  {
    path: "/workspace",
    name: "Workspace",
    component: Workspace,
  },
  {
    path: "/news",
    name: "News",
    component: News,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL), // 使用 HTML5 History 模式
  routes,
});

export default router;
