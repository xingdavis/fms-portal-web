import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
// import store from "./store";
import { createPinia } from "pinia"; // 确保导
const pinia = createPinia(); // 创建 Pinia 实例

createApp(App).use(ElementPlus).use(router).use(pinia).mount("#app");
