import { createApp } from "vue";
// import { createPinia } from 'pinia';
// import { } from 'vuex'
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import VueScrollTo from "vue-scrollto";
import "./assets/style/common.css";
import "./assets/font/iconfont";
import router from "./router";
import store from "./store";

const app = createApp(App);

app.use(VueScrollTo, {
  container: "body",
  duration: 500,
  easing: "ease",
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true,
});
app.use(ElementPlus);
app.use(router);
app.use(store);
app.mount("#app");
