<template>
  <div class="index">
    <Header :class="index_header"></Header>
    <div class="banner-wrap">
      <Banner :BannerHeight="bannerHeight"></Banner>
      <over-lay></over-lay>
      <scroll-hint
        v-scroll-to="{
          element: '.wrap-block',
          duration: 300,
          easing: 'ease',
          offset: 1,
        }"
      ></scroll-hint>
    </div>
    <IndexService></IndexService>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount } from "vue";
// import { useStore } from "../../store";
import { useStore } from "vuex";
import Header from "@/components/web/layout/Header.vue";
import Footer from "@/components/web/layout/Footer.vue";
import Banner from "@/components/web/Banner.vue";
import overLay from "@/components/web/overLay.vue";
import scrollHint from "@/components/web/scrollHint.vue";
import IndexService from "@/components/web/IndexService.vue";
import store from "../../store";

const setBannerHeight = () => {
  bannerHeight = window.innerHeight;
  store.commit("setBannerHeight", bannerHeight);
  // main.$patch({ bannerHeight: bannerHeight });
};

//计算scrollTop
const scrollHandle = () => {
  scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  if (scrollTop <= bannerHeight - 35) {
    // console.log("=====>", store);
    //显示头部logo
    store.commit("setHeaderLogo", true);
    store.commit("setShadowActive", false);
    store.commit("setNavDarkActive", false);
  } else {
    store.commit("setHeaderLogo", false);
    store.commit("setShadowActive", true);
    store.commit("setNavDarkActive", true);
  }
  //滚动条滚动的距离
  const scrollStep = scrollTop - oldScrollTop;
  oldScrollTop = scrollTop;
  scrollStep >= 0
    ? store.commit("setHeaderShow", true)
    : store.commit("setHeaderShow", false);

  // console.log(store.state.headerShow);
};

onMounted(() => {
  //页面创建时执行一次getHeight
  window.addEventListener("resize", setBannerHeight);
  setBannerHeight();
  window.addEventListener("scroll", scrollHandle);
});

onBeforeMount(() => {
  window.removeEventListener("scroll", scrollHandle);
  window.removeEventListener("resize", setBannerHeight);
});

let index_header = $ref("");
let bannerHeight = $ref(0);
let scrollTop = $ref(0);
let oldScrollTop = $ref(0);
</script>

<style lang="scss" scoped>
.banner-wrap {
  overflow: hidden;
  position: relative;
}

.overlay {
  z-index: 666;
}

.wrap-block {
  position: relative;
  padding-top: 54px;
}
</style>
