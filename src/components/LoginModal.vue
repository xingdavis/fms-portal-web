<!-- src/components/LoginModal.vue -->
<template>
  <div v-if="props.visible" style="z-index: 9999; position: fixed">
    <div class="v-modal"></div>
    <div class="login-box">
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
              <!-- <form
                class="el-form login-form el-form--label-top"
                @submit.prevent="handleLogin"
              > -->
              <el-form
                class="el-form login-form el-form--label-top"
                ref="loginFormRef"
                :model="loginFormData"
                :rules="loginRules"
                @submit.prevent="handleLogin"
              >
                <div class="title">欢迎登录冠捷报价查询平台</div>
                <div class="el-form-item is-required">
                  <div class="el-form-item__content">
                    <div class="el-input el-input--prefix">
                      <div class="el-input-title item_label">
                        <i>*</i> 登录账号：
                      </div>
                      <el-form-item prop="username">
                        <el-input
                          v-model="loginFormData.username"
                          placeholder="请输入登录账号"
                          maxlength="128"
                        >
                        </el-input>
                      </el-form-item>
                      <!-- <input
                        v-model="account"
                        type="text"
                        autocomplete="off"
                        maxlength="128"
                        placeholder="请输入登录账号"
                        class="el-input__inner"
                      /> -->
                    </div>
                    <div class="el-form-item__error" v-if="accountError">
                      {{ accountError }}
                    </div>
                  </div>
                </div>
                <div class="el-form-item is-required">
                  <div class="el-form-item__content">
                    <div class="el-input el-input--prefix">
                      <div class="el-input-title item_label">
                        <i>*</i> 登录密码：
                      </div>
                      <el-form-item prop="password">
                        <el-input
                          v-model="loginFormData.password"
                          placeholder="请输入登录密码"
                          maxlength="128"
                          type="password"
                          show-password
                        >
                        </el-input>
                      </el-form-item>
                      <!-- <input
                        v-model="password"
                        type="password"
                        autocomplete="off"
                        maxlength="128"
                        placeholder="请输入登录密码"
                        class="el-input__inner"
                      /> -->
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
                  class="el-button log-btn el-button--primary login-button"
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
                <!-- </form> -->
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/store";
const props = defineProps({
  // 控制模态框的显示和隐藏
  visible: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();

const loginFormData = ref({
  username: "",
  password: "",
  captchaKey: "",
  captchaCode: "",
  rememberMe: false,
});

const loginFormRef = ref();

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: "请输入用户名",
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: "请输入登录密码",
      },
      {
        min: 6,
        message: "密码长度不能小于6位",
        trigger: "blur",
      },
    ],
    // captchaCode: [
    //   {
    //     required: true,
    //     trigger: "blur",
    //     message: t("login.message.captchaCode.required"),
    //   },
    // ],
  };
});

// const account = ref("");
// const password = ref("");
const rememberMe = ref(false);
const accountError = ref("");
const passwordError = ref("");
const loading = ref(false); // 按钮 loading 状态

const handleLogin = async () => {
  // accountError.value = "";
  // passwordError.value = "";

  // if (!account.value) accountError.value = "账号不能为空";
  // else if (account.value !== correctAccount) accountError.value = "账号不正确";

  // if (!password.value) passwordError.value = "密码不能为空";
  // else if (password.value !== correctPassword)
  //   passwordError.value = "密码不正确";

  // if (!accountError.value && !passwordError.value) {
  //   alert("登录成功！");
  //   if (rememberMe.value) console.log("7天免登录已勾选");
  //   closeModal();
  // }

  try {
    // 1. 表单验证
    const valid = await loginFormRef.value?.validate();
    if (!valid) return;

    loading.value = true;

    // 2. 执行登录
    userStore.login(loginFormData.value);

    // 3. 获取用户信息
    // await userStore.getUserInfo();

    // 4. 解析并跳转目标地址
    // const redirect = resolveRedirectTarget(route.query);
    // await router.push(redirect);
    // 5. 关闭登录框
    closeModal();

    // TODO 5. 判断用户是否点击了记住我？采用明文保存或使用jsencrypt库？
  } catch (error) {
    // 5. 统一错误处理
    // getCaptcha(); // 刷新验证码
    // console.error("登录失败:", error);
    ElMessage.error(error.message || "登录失败，请稍后重试");
    // return;
  } finally {
    loading.value = false;
  }
};

const toggleRemember = () => {
  rememberMe.value = !rememberMe.value;
};

const forgetPassword = () => {
  alert("忘记密码功能待实现");
};

const closeModal = () => {
  // 直接通过emit触发关闭事件，由父组件控制visible状态
  emit("close");
};

// const showModal = () => {
//   console.log("showModal called");
//   // visible.value = true;
// };

// defineExpose({ showModal });
const emit = defineEmits(["close"]);
</script>
<style scoped>
/* 或者更精确的选择 */
:deep(.el-input__wrapper) {
  padding: 0px;
}
.item_label {
  min-width: 110px;
}
.login-button {
  padding-top: 12px;
  padding-bottom: 30px;
}
</style>
