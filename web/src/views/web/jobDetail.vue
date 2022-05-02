<template>
  <div>
    <Header class="job-header" ref="news-header"></Header>
    <div class="content-container">
      <div class="jobDetail">
        <h1>{{ jobDetail.title }}</h1>
        <div class="job-info">
          <span>{{ jobDetail.city }}</span>
          <div class="lineDivider"></div>
          <span>{{ jobDetail.job_category }}</span>
          <div class="lineDivider"></div>
          <div class="publish-time">
            <span>发布时间:</span>&nbsp;<span>{{
              jobDetail.publish_time
            }}</span>
          </div>
        </div>
        <div class="description">
          <h2>职位描述</h2>
          <!-- TODO:use wangEditor -->
          <!-- <mavon-editor
            ref="description"
            class="markdown"
            v-model="jobDetail.description"
            :subfield="false"
            :boxShadow="false"
            defaultOpen="preview"
            :toolbarsFlag="false"
          /> -->
        </div>
        <div class="requirement">
          <h2>职位要求</h2>
          <!-- <mavon-editor
            ref="requirement"
            class="markdown"
            v-model="jobDetail.requirement"
            :subfield="false"
            :boxShadow="false"
            defaultOpen="preview"
            :toolbarsFlag="false"
          /> -->
        </div>
        <div class="update-time">
          <span>最近更新时间：</span>&nbsp;&nbsp;<span>{{
            jobDetail.update_time
          }}</span>
        </div>
        <el-button round type="primary" style="width: 150px"
          ><a href="mailto:aerowangue@126.com">投递</a></el-button
        >
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import Header from "../../components/web/layout/Header.vue";
import Footer from "../../components/web/layout/Footer.vue";
import useJobApi from "../../apis/job";
let jobDetail = $ref<{
  title?: string;
  city?: any;
  description?: string;
  requirement?: string;
  job_category?: string;
  publish_time?: string;
  update_time?: string;
}>({});
const job_path = computed(() => {
  const route = useRoute();
  return route.params.id as string;
});

const jobApi = useJobApi();

const getJobDetail = async () => {
  //@ts-ignore
  const { data: res } = await jobApi.getJobDetail(job_path);
  if (res.status !== 200) {
    console.log(res);
  } else {
    jobDetail = {
      title: res.data.title,
      city: res.data.city,
      description: res.data.description,
      requirement: res.data.requirement,
      job_category: res.data.job_category,
      publish_time: res.data.publish_time,
      update_time: res.data.update_time,
    };
  }
};

//挂载前
onBeforeMount(() => {
  getJobDetail();
}),
  //挂载完成时
  onMounted(() => {
    const store = useStore();
    store.commit("setHeaderLogo", false);
    store.commit("setShadowActive", true);
    store.commit("setNavDarkActive", true);
    store.commit("setHeaderShow", false);
  });

//离开组件时
onBeforeRouteLeave((to, from, next) => {
  const store = useStore();
  if (to.name === "index") {
    store.commit("setHeaderLogo", true);
    store.commit("setShadowActive", false);
    store.commit("setNavDarkActive", false);
    store.commit("setHeaderShow", false);
  }
  next();
});
</script>

<style lang="scss" scoped>
.job-header {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.content-container {
  padding-top: 60px;
  width: 100%;

  * {
    box-sizing: border-box;
  }
}

h1 {
  font-size: 30px;
  font-weight: 800;
  color: #1f2329;
  margin-bottom: 13px;
}

.job-info,
.update-time {
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  color: #646a73;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
}

.update-time {
  margin-top: 20px;
  margin-bottom: 20px;
}
a,
a:hover,
a:active,
a:visited,
a:link,
a:focus {
  outline: none;
  background: none;
  text-decoration: none;
  color: #ffffff;
}
.lineDivider {
  display: inline-block;
  width: 1px;
  height: 12px;
  background-color: #bbbfc4;
  margin: 0 8px;
}

h2 {
  margin: 50px 0 8px;
  font-size: 21px;
  line-height: 1.52;
  font-weight: 800;
  color: #1f2329;
}

.jobDetail {
  font-size: 16px;
  max-width: 800px;
  min-height: 573px;
  margin: 60px auto 110px;
  padding-left: 32px;

  .markdown {
    position: relative;
    z-index: 0;
    border: none !important;

    :deep .v-show-content {
      background-color: #ffffff !important;
      padding: 0 !important;
    }
  }

  :deep .v-note-wrapper {
    min-height: 50px;
  }
}
</style>
