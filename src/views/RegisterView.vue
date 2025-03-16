<!-- src/views/Register.vue -->
<template>
  <div>
    <navigation @show-login="showLoginModal" />
    <div class="register-content">
      <h1>注册</h1>
      <form class="register-form" @submit.prevent="handleRegister">
        <div class="form-item">
          <label>用户名</label>
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>
        <div class="form-item">
          <label>密码</label>
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>
        <div class="form-item">
          <label>确认密码</label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请确认密码"
            required
          />
        </div>
        <button type="submit" class="register-btn">注册</button>
      </form>
      <p>已有账号？<router-link to="/">去登录</router-link></p>
    </div>
    <Footer />
    <login-modal ref="loginModal" @close="showLogin = false" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Navigation from "@/components/NavigationComponent.vue";
import Footer from "@/components/FooterComponent.vue";
import LoginModal from "@/components/LoginModal.vue";

const router = useRouter();
const modal = ref(null);
const showLogin = ref(false);

const username = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert("两次输入的密码不一致！");
    return;
  }
  alert("注册成功！请登录");
  router.push("/");
};

const showLoginModal = () => {
  modal.value.showModal();
  showLogin.value = true;
};
</script>

<style scoped>
.register-content {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-item {
  display: flex;
  flex-direction: column;
}

.form-item label {
  margin-bottom: 5px;
}

.form-item input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.register-btn {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.register-btn:hover {
  background-color: #0056b3;
}
</style>
