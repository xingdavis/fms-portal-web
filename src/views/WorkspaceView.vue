<!-- src/views/MemberOrder.vue -->
<template>
  <div>
    <navigation @show-login="showLoginModal" />
    <h1>工作台</h1>
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

const showLoginModal = () => {
  modal.value.showModal();
  showLogin.value = true;
};
</script>
