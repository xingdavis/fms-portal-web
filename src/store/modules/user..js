import { store } from "@/store";
// import { usePermissionStoreHook } from "@/store/modules/permission.store";
// import { useDictStoreHook } from "@/store/modules/dict";

import AuthAPI from "@/api/auth";
// import { LoginFormData } from "@/api/auth.api";
import UserAPI from "@/api/qms/member";
import { ElMessage } from "element-plus";

import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearToken,
} from "@/utils/auth";
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const userInfo = useStorage("userInfo", {});
  const isLoggedIn = ref(false); // 登录状态

  /**
   * 登录
   *
   * @param {LoginFormData}
   * @returns
   */
  function login(LoginFormData) {
    AuthAPI.login(LoginFormData)
      .then((data) => {
        const { token } = data;
        setAccessToken(token); // eyJhbGciOiJIUzI1NiJ9.xxx.xxx
        isLoggedIn.value = true; // 登录成功设置状态
        // setRefreshToken(refreshToken);
        // resolve();
        ElMessage.success("登录成功");
      })
      .catch((error) => {
        // reject(error);
        console.log(error);
        isLoggedIn.value = false; // 登录失败重置状态
        ElMessage.error("登录异常");
      });
    // eslint-disable-next-line no-unused-vars
    // return new Promise((resolve, reject) => {
    //   AuthAPI.login(LoginFormData)
    //     .then((data) => {
    //       console.log("登录成功", data);
    //       const { accessToken, refreshToken } = data;
    //       setAccessToken(accessToken); // eyJhbGciOiJIUzI1NiJ9.xxx.xxx
    //       setRefreshToken(refreshToken);
    //       resolve();
    //     })
    //     .catch((error) => {
    //       // reject(error);
    //       console.log(error);
    //     });
    // });
  }

  /**
   * 获取用户信息
   *
   * @returns {UserInfo} 用户信息
   */
  function getUserInfo() {
    return new Promise((resolve, reject) => {
      UserAPI.getInfo()
        .then((data) => {
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          Object.assign(userInfo.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 登出
   */
  function logout() {
    return new Promise((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          clearSessionAndCache();
          isLoggedIn.value = false; // 登出时重置状态
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 刷新 token
   */
  function refreshToken() {
    const refreshToken = getRefreshToken();
    return new Promise((resolve, reject) => {
      AuthAPI.refreshToken(refreshToken)
        .then((data) => {
          const { accessToken, refreshToken } = data;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);
          resolve();
        })
        .catch((error) => {
          console.log(" refreshToken  刷新失败", error);
          reject(error);
        });
    });
  }

  /**
   * 清除用户会话和缓存
   */
  function clearSessionAndCache() {
    return new Promise((resolve) => {
      clearToken();
      // usePermissionStoreHook().resetRouter();
      // useDictStoreHook().clearDictCache();
      isLoggedIn.value = false; // 清除缓存时重置状态
      userInfo.value = {};
      resolve();
    });
  }

  return {
    userInfo,
    getUserInfo,
    login,
    logout,
    clearSessionAndCache,
    refreshToken,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
