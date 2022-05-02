<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
onMounted(() => {
  //TODO:跳转到登录页面
  const router = useRouter();
  router.push("/index");
});
</script>
