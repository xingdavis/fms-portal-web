import axios from "axios";
import qs from "qs";
import { useUserStoreHook } from "@/store/modules/user.";
// import { ResultEnum } from "@/enums/api/result.enum";
import { getAccessToken } from "@/utils/auth";
import router from "@/router";
import { ElMessage, ElNotification } from "element-plus";

/**
 * 响应码枚举
 */
const ResponseCodeEnum = {
  /**
   * 成功
   */
  SUCCESS: 200,
  /**
   * 错误
   */
  ERROR: 500,

  /**
   * 访问令牌无效或过期
   */
  ACCESS_TOKEN_INVALID: 401,

  /**
   * 刷新令牌无效或过期
   */
  REFRESH_TOKEN_INVALID: 402,
};

// 创建 axios 实例
const service = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.VUE_APP_BASE_URL
      : "/api",
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
  paramsSerializer: (params) => qs.stringify(params),
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    // 如果 Authorization 设置为 no-auth，则不携带 Token
    if (config.headers.Authorization !== "no-auth" && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 如果响应是二进制流，则直接返回，用于下载文件、Excel 导出等
    if (response.config.responseType === "blob") {
      return response;
    }
    // console.log("response", response);
    const { code, data, message } = response.data;
    if (code === ResponseCodeEnum.SUCCESS) {
      return data;
    }
    // ElNotification.error(msg || "系统出错");
    ElMessage.error(message || "系统出错");
    // return Promise.reject(new Error(msg || "Error"));
    // 在这里处理错误，返回一个 resolved Promise 防止传播
    return Promise.reject({
      isHandled: true,
      error: message || "Error",
    });
  },
  async (error) => {
    console.error("request error", error); // for debug
    const { config, response } = error;
    if (response) {
      const { code, message } = response.data;
      if (code === ResponseCodeEnum.ACCESS_TOKEN_INVALID) {
        // Token 过期，刷新 Token
        return handleTokenRefresh(config);
      } else if (code === ResponseCodeEnum.REFRESH_TOKEN_INVALID) {
        // 刷新 Token 过期，跳转登录页
        await handleSessionExpired();
        return Promise.reject(new Error(message || "Error"));
      } else {
        ElMessage.error(message || "系统出错");
      }
    }
    // return Promise.reject(error.message);
    // 在这里处理错误，返回一个 resolved Promise 防止传播
    return Promise.reject({
      isHandled: true,
      error: error.message,
    });
  }
);
export default service;
// 是否正在刷新标识，避免重复刷新
let isRefreshing = false;
// 因 Token 过期导致的请求等待队列
const waitingQueue = [];
// 刷新 Token 处理
async function handleTokenRefresh(config) {
  return new Promise((resolve) => {
    // 封装需要重试的请求
    const retryRequest = () => {
      config.headers.Authorization = `Bearer ${getAccessToken()}`;
      resolve(service(config));
    };
    waitingQueue.push(retryRequest);
    if (!isRefreshing) {
      isRefreshing = true;
      useUserStoreHook()
        .refreshToken()
        .then(() => {
          // 依次重试队列中所有请求, 重试后清空队列
          waitingQueue.forEach((callback) => callback());
          waitingQueue.length = 0;
        })
        .catch(async (error) => {
          console.error("handleTokenRefresh error", error);
          // 刷新 Token 失败，跳转登录页
          await handleSessionExpired();
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
  });
}
// 处理会话过期
async function handleSessionExpired() {
  ElNotification({
    title: "提示",
    message: "您的会话已过期，请重新登录",
    type: "info",
  });
  await useUserStoreHook().clearSessionAndCache();
  router.push("/login");
}
