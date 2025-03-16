<!-- src/components/LoginModal.vue -->
<template>
  <div class="v-modal" @click="closeModal" v-if="visible"></div>
  <div class="login-box" v-if="visible">
    <div class="el-dialog__wrapper login-dlg">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="dialog"
        class="el-dialog"
        style="margin-top: 15vh"
      >
        <div class="el-dialog__header">
          <span class="el-dialog__title"></span>
          <button
            type="button"
            aria-label="Close"
            class="el-dialog__headerbtn"
            @click="closeModal"
          >
            <i class="el-icon-close">x</i>
          </button>
        </div>
        <div class="el-dialog__body">
          <div class="login-container">
            <img
              src="@/assets/images/loginleft.af6cd311.png"
              class="login-pic"
              alt="登录图片"
            />
            <form
              class="el-form login-form el-form--label-top"
              @submit.prevent="handleLogin"
            >
              <div class="title">欢迎登录冠捷报价查询平台</div>
              <div class="el-form-item is-required">
                <div class="el-form-item__content">
                  <div class="el-input el-input--prefix">
                    <div class="el-input-title"><i>*</i> 登录账号：</div>
                    <input
                      v-model="account"
                      type="text"
                      autocomplete="off"
                      maxlength="128"
                      placeholder="请输入登录账号"
                      class="el-input__inner"
                    />
                  </div>
                  <div class="el-form-item__error" v-if="accountError">
                    {{ accountError }}
                  </div>
                </div>
              </div>
              <div class="el-form-item is-required">
                <div class="el-form-item__content">
                  <div class="el-input el-input--prefix">
                    <div class="el-input-title"><i>*</i> 登录密码：</div>
                    <input
                      v-model="password"
                      type="password"
                      autocomplete="off"
                      maxlength="128"
                      placeholder="请输入登录密码"
                      class="el-input__inner"
                    />
                  </div>
                  <div class="el-form-item__error" v-if="passwordError">
                    {{ passwordError }}
                  </div>
                </div>
              </div>
              <div class="flex_bc">
                <label class="el-checkbox">
                  <span
                    class="el-checkbox__input"
                    :class="{ 'is-checked': rememberMe }"
                    @click="toggleRemember"
                  >
                    <span class="el-checkbox__inner"></span>
                    <input
                      type="checkbox"
                      v-model="rememberMe"
                      class="el-checkbox__original"
                      hidden
                    />
                  </span>
                  <span class="el-checkbox__label">7天免登录</span>
                </label>
                <span class="forget-pwd" @click="forgetPassword"
                  >忘记密码?</span
                >
              </div>
              <button
                type="submit"
                class="el-button log-btn el-button--primary"
              >
                登录
              </button>
              <div class="title-container">
                <div>还不是冠捷会员？</div>
                <div>
                  点击<router-link to="/register" class="quick-regist"
                    >快速注册</router-link
                  >，注册后获取更多航线低价！
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineExpose } from "vue";

const visible = ref(false);
const account = ref("");
const password = ref("");
const rememberMe = ref(false);
const accountError = ref("");
const passwordError = ref("");

const correctAccount = "aa";
const correctPassword = "123456";

const handleLogin = () => {
  accountError.value = "";
  passwordError.value = "";

  if (!account.value) accountError.value = "账号不能为空";
  else if (account.value !== correctAccount) accountError.value = "账号不正确";

  if (!password.value) passwordError.value = "密码不能为空";
  else if (password.value !== correctPassword)
    passwordError.value = "密码不正确";

  if (!accountError.value && !passwordError.value) {
    alert("登录成功！");
    if (rememberMe.value) console.log("7天免登录已勾选");
    closeModal();
  }
};

const toggleRemember = () => {
  rememberMe.value = !rememberMe.value;
};

const forgetPassword = () => {
  alert("忘记密码功能待实现");
};

const closeModal = () => {
  visible.value = false;
  emit("close");
};

const showModal = () => {
  visible.value = true;
};

defineExpose({ showModal });
const emit = defineEmits(["close"]);
</script>
