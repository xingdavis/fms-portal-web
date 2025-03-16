<!-- src/components/Navigation.vue -->
<template>
  <div class="site-navigation main_menu menu-style-2" id="mainmenu-area">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid container-padding">
        <router-link class="navbar-brand" to="/">
          <img
            src="@/assets/images/dark-logo.png"
            alt="logo"
            class="img-fluid"
          />
        </router-link>
        <button class="navbar-toggler" @click="toggleMenu">
          <span class="fa fa-bars"></span>
        </button>

        <div class="collapse navbar-collapse" :class="{ show: menuOpen }">
          <ul class="navbar-nav">
            <li class="nav-item" :class="{ 'nav-cur': activeNav === 'home' }">
              <router-link
                to="/"
                class="nav-link"
                @mouseover="setActive('home')"
                >首页</router-link
              >
            </li>
            <li
              class="nav-item"
              :class="{ 'nav-cur': activeNav === 'freight' }"
            >
              <router-link
                to="/freightRateList"
                class="nav-link"
                @mouseover="setActive('freight')"
                >运价查询</router-link
              >
            </li>
            <li
              class="nav-item"
              :class="{ 'nav-cur': activeNav === 'endtoend' }"
            >
              <router-link
                to="#"
                class="nav-link"
                @mouseover="setActive('endtoend')"
                >端到端</router-link
              >
            </li>
            <li
              class="nav-item"
              :class="{ 'nav-cur': activeNav === 'warehouse' }"
            >
              <router-link
                to="#"
                class="nav-link"
                @mouseover="setActive('warehouse')"
                >仓储服务</router-link
              >
            </li>
            <li
              class="nav-item"
              :class="{ 'nav-cur': activeNav === 'workspace' }"
            >
              <router-link
                to="/member_order"
                class="nav-link"
                @mouseover="setActive('workspace')"
                >工作台</router-link
              >
            </li>
            <li class="nav-item" :class="{ 'nav-cur': activeNav === 'news' }">
              <router-link
                to="/news"
                class="nav-link"
                @mouseover="setActive('news')"
                >行业资讯</router-link
              >
            </li>
          </ul>

          <div class="header-login">
            <a href="#"
              ><img class="ring-icon" src="@/assets/images/ring.png"
            /></a>
            <div class="tourist" v-if="!isLoggedIn">
              <a
                href="javascript:;"
                class="btn-an btn-login"
                @click="showLoginModal"
                >登录</a
              >
              <router-link to="/register" class="btn-an">注册</router-link>
            </div>
            <div class="member" v-else>
              <div class="picture">
                <img src="@/assets/images/member-bodyicon.png" />
              </div>
              <div class="text">
                <p class="h1">
                  黄碧峰<img src="@/assets/images/rz-icon.png" />
                </p>
                <p class="h2">广州冠捷国际货运有限公司</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";

const menuOpen = ref(false);
const activeNav = ref("home");
const isLoggedIn = ref(false);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const setActive = (nav) => {
  activeNav.value = nav;
};

const showLoginModal = () => {
  emit("show-login");
};

const emit = defineEmits(["show-login"]);
</script>
