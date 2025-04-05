<!-- src/views/FreightRateList.vue -->
<template>
  <div>
    <login-modal :visible="showLogin" @close="showLogin = false" />
    <navigation @show-login="showLoginModal" />
    <OfferQuery :startPort="startPort" :destinationPort="destinationPort" />
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Navigation from "@/components/NavigationComponent.vue";
import OfferQuery from "@/components/OfferQuery.vue";
import Footer from "@/components/FooterComponent.vue";
import LoginModal from "@/components/LoginModal.vue";
import { useUserStore } from "@/store";
const userStore = useUserStore();

const route = useRoute();
const showLogin = ref(false);
const showLoginModal = () => {
  showLogin.value = true;
};

// 从路由参数中获取起运港和目的港
const startPort = ref(route.query.startPort || null);
const destinationPort = ref(route.query.destinationPort || null);
onMounted(() => {
  console.log("startPort:", startPort.value);
  console.log("destinationPort:", destinationPort.value);
  showLogin.value = !userStore.isLoggedIn;
});
</script>
