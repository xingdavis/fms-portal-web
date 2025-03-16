<!-- src/views/Home.vue -->
<template>
  <Navigation @show-login="showLoginModal" />
  <Banner />
  <spectial-offer />
  <Footer />
  <login-modal v-if="showLogin" @close="showLogin = false" />
</template>

<script setup>
import { ref } from "vue";
import Navigation from "@/components/NavigationComponent.vue";
import Banner from "@/components/BannerComponent.vue";
import SpectialOffer from "@/components/SpectialOffer.vue";
import Footer from "@/components/FooterComponent.vue";
import LoginModal from "@/components/LoginModal.vue";

const modal = ref(null);
const showLogin = ref(false);
const showLoginModal = () => {
  modal.value.showModal();
  showLogin.value = true;
};
</script>
