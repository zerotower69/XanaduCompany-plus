<template>
  <div>
    <ul class="news-list-items" v-if="items !== undefined">
      <li class="news-list-item" v-for="(item, index) in items" :key="index">
        <el-card shadow="hover">
          <router-link :to="`/news/${item.news_path}`">
            <!--<div class = "item-mask"></div>-->
            <img :src="item.cover_img" alt="" />
            <div class="item-content">
              <h2>{{ item.news_title }}</h2>
              <p>{{ item.news_desc }}</p>
              <span>{{ item.publish_time }}</span>
            </div>
          </router-link>
        </el-card>
      </li>
    </ul>
    <span class="is-null" v-else>暂无数据</span>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{
  items: Array<any>;
}>();
//当前页数
let currentPage = $ref(1);

const setArticlePath = (path: string) => {
  console.log("path===>", path);
  //TODO:store set article path
};
</script>
