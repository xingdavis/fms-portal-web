<!-- src/views/FreightRateList.vue -->
<template>
  <div>
    <navigation @show-login="showLoginModal" />
    <OfferQuery :startPort="startPort" :destinationPort="destinationPort" />
    <Footer />
    <login-modal ref="loginModal" @close="showLogin = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";
import Navigation from "@/components/NavigationComponent.vue";
import OfferQuery from "@/components/OfferQuery.vue";
import Footer from "@/components/FooterComponent.vue";
import LoginModal from "@/components/LoginModal.vue";

const route = useRoute();
const modal = ref(null);
const showLogin = ref(false);

// 从路由参数中获取起运港和目的港
const startPort = ref(route.query.startPort || null);
const destinationPort = ref(route.query.destinationPort || null);

const showLoginModal = () => {
  modal.value.showModal();
  showLogin.value = true;
};
</script>
