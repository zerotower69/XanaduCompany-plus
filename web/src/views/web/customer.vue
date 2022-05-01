<template>
  <div class="customer">
    <Header class="customer_header" ref="customer_header"></Header>
    <div class="box">
      <h1>客户服务</h1>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import Header from "../../components/web/layout/Header.vue";
import Footer from "../../components/web/layout/Footer.vue";

onMounted(() => {
  //TODO:vuex commit
});
</script>

<style scoped>
.customer_header {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #eff0f1;
}
.box {
  padding-top: 60px;
}
</style>
