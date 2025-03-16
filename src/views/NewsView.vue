<!-- src/views/News.vue -->
<template>
  <div>
    <navigation @show-login="showLoginModal" />
    <div class="news-content">
      <h1>行业资讯</h1>
      <div class="news-wrap">
        <div class="title-wrap">
          <span class="flex-ac">
            <img src="@/assets/images/info-icon.png" alt="资讯图标" /> 行业资讯
          </span>
        </div>
        <div class="zx-more">更多新闻</div>
        <div class="news-item" v-for="(item, index) in newsList" :key="index">
          <div class="index">{{ String(index + 1).padStart(2, "0") }}</div>
          <div class="title">
            <p>{{ item.title }}</p>
            <span>{{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    <login-modal ref="loginModal" @close="showLogin = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navigation from "@/components/NavigationComponent.vue";
import Footer from "@/components/FooterComponent.vue";
import LoginModal from "@/components/LoginModal.vue";

const modal = ref(null);
const showLogin = ref(false);

const newsList = ref([
  {
    title:
      "44个集装箱落水，30个箱子损坏！挂靠国内多个港口的达飞集装箱船遭遇突发事故！",
    date: "2025-01-08 11:50:09",
  },
  {
    title: "突发：2月曾挂靠国内港口！MSC一货船被伊朗扣押！",
    date: "2025-01-08 11:50:09",
  },
  {
    title: "多项服务受影响！马士基船舶与大桥相撞后，暂停巴尔的摩港停靠",
    date: "2025-01-08 11:50:09",
  },
  {
    title:
      "曾挂靠国内港口！一集装箱船在巴尔的摩与桥柱相撞，大桥坍塌，多人落水！",
    date: "2025-01-08 11:50:09",
  },
  { title: "MOL将开发连接葡萄牙和北欧的绿色走廊", date: "2025-01-08 11:50:09" },
  { title: "笛卡尔报告：目前美国集装箱进口强劲", date: "2025-01-08 11:50:09" },
]);

const showLoginModal = () => {
  modal.value.showModal();
  showLogin.value = true;
};
</script>
