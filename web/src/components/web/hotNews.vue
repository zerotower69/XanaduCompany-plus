<template>
  <el-card class="hot-news">
    <h3 class="hot-title">热门新闻</h3>
    <ul class="hot-list" v-if="hotNews.length !== 0">
      <li class="hot-list-item" v-for="(item, index) in hotNews" :key="index">
        <span class="num-top">{{ index + 1 }}</span>
        <p>
          <router-link :to="`/news/${item.news_path}`">{{
            item.news_title
          }}</router-link>
          <span class="hot-date">{{ item.publish_time }}</span>
        </p>
      </li>
    </ul>
    <span class="is-null" v-else>暂无数据</span>
  </el-card>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import apis from "../../apis";
interface newsItem {
  news_path: string;
  news_title: string;
  publish_time: string;
}
let hotNews = $ref<Array<newsItem>>([]);
const newsApi = apis.useNewsApi();

const getHotNews = async () => {
  const { data: res } = await newsApi.apiGetHotNews();
  hotNews = res.status === 200 ? res.data.list : [];
};
//挂载前 就请求api
onBeforeMount(() => {
  getHotNews();
});
</script>
