<!-- src/views/Home.vue -->
<template>
  <login-modal :visible="showLogin" @close="showLogin = false" />
  <Navigation @show-login="showLoginModal" />
  <Banner />
  <spectial-offer />
  <Footer />
</template>

<script setup>
import { ref } from "vue";
import Navigation from "@/components/NavigationComponent.vue";
import Banner from "@/components/BannerComponent.vue";
import SpectialOffer from "@/components/SpectialOffer.vue";
import Footer from "@/components/FooterComponent.vue";
import LoginModal from "@/components/LoginModal.vue";
// import { useUserStore } from "@/store";
// const userStore = useUserStore();

const showLogin = ref(false);
const showLoginModal = () => {
  showLogin.value = true;
};
</script>
