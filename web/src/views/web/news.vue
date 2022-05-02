<template>
  <div class="news">
    <Header class="news_header" ref="news_header"></Header>
    <div class="box">
      <div class="news-banner">
        <div class="banner-title">
          <h2>新视野</h2>
          <h3>了解更多新闻</h3>
        </div>
        <el-autocomplete
          class="search-news"
          popper-class="my-autocomplete"
          highlight-first-item
          v-model="searchNews"
          clearable
          ref="autocomplete"
          @focus="autocompleteFlag = true"
          @blur="autocompleteFlag = false"
          @clear="searchHandle"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入新闻关键词"
          :trigger-on-focus="false"
        >
          <template v-slot:prefix>
            <i class="el-input__icon el-icon-search"></i>
          </template>
          <template v-slot:default="{ item }">
            <router-link :to="item.news_path" target="_blank">
              <div class="name" v-html="item.news_title"></div>
              <span class="desc" v-html="item.news_desc"></span>
            </router-link>
          </template>
        </el-autocomplete>
      </div>
      <div class="news-container">
        <div class="news-card">
          <el-card
            shadow="never"
            v-for="(item, index) in recomNews"
            :key="index"
          >
            <router-link :to="`/news/${(item as any).news_path}`">
              <div class="news-card-item">
                <img :src="(item as any).cover_img" alt="" />
                <p class="item-mask">
                  <span>{{ (item as any).news_title }}</span>
                </p>
              </div>
            </router-link>
          </el-card>
        </div>
        <div class="news-list">
          <el-tabs
            class="list-left"
            v-model="pageInfo.activeName"
            @tab-click="handleClick"
          >
            <el-tab-pane :label="newsTabs[0].name" :name="newsTabs[0].id">
              <news-list
                :items="(newsItems as any).list"
                v-if="pageInfo.activeName === newsTabs[0].id"
              ></news-list>
            </el-tab-pane>
            <el-tab-pane :label="newsTabs[1].name" :name="newsTabs[1].id">
              <news-list
                :items="(newsItems as any).list"
                v-if="pageInfo.activeName === newsTabs[1].id"
              ></news-list>
            </el-tab-pane>
            <el-tab-pane :label="newsTabs[2].name" :name="newsTabs[2].id">
              <news-list
                :items="(newsItems as any).list"
                v-if="pageInfo.activeName === newsTabs[2].id"
              ></news-list>
            </el-tab-pane>
            <el-pagination
              class="pagination"
              background
              @current-change="handleCurrentChange"
              :current-page.sync="pageInfo.pagenum"
              :page-size="pageInfo.pagesize"
              layout="prev, pager, next, jumper"
              :total="(newsItems as any).total"
              :hide-on-single-page="singlePage"
              v-scroll-to="{
                element: '.news-container',
                duration: 300,
                easing: 'ease',
                offset: -40,
              }"
            >
            </el-pagination>
          </el-tabs>
          <div class="list-right">
            <div class="search-by-date">
              <p>按日期搜索：</p>
              <el-date-picker
                v-model="pageInfo.selectDate"
                type="month"
                placeholder="选择日期"
                value-format="yyyy-MM"
                @change="searchByDate(pageInfo.selectDate)"
              >
              </el-date-picker>
            </div>
            <hot-news></hot-news>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onBeforeMount, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useStore } from "vuex";
import Header from "../../components/web/layout/Header.vue";
import Footer from "../../components/web/layout/Footer.vue";
import newsList from "../../components/web/newsList.vue";
import hotNews from "../../components/web/hotNews.vue";
import store from "../../store";

import useNewsApi from "../../apis/news";

//data && computed
let searchNews = $ref("");
let newsTabs = $ref([
  { id: "1", name: "最新动态" },
  {
    id: "2",
    name: "典型案例",
  },
  {
    id: "3",
    name: "通知公告",
  },
]);
let newsItems = $ref({});
let pageInfo = $ref({
  activeName: 1,
  //当前页面
  pagenum: 1,
  //每页显示的数据总数
  pagesize: 10,
  selectDate: "",
});
//单页隐藏
let singlePage = $ref(false);
//卡片新闻
let recomNews = $ref([]);
let selectDate = $ref("");
let searchList = $ref([]);
let timeout = $ref(null);
let autocompleteFlag = $ref(false);
const newsApi = useNewsApi();

//搜索新闻
const querySearchAsync = async (
  queryString: string,
  cb: (data: any) => void
) => {
  searchList = [];
  const { data: res } = await newsApi.searchNewsByKeyword(queryString);
  if (res.status !== 200) {
    //接口返回状态不是200  失败了做点什么
  } else {
    searchList = res.data.list;
  }
  const newHtml = `<span style="color:#3370ff">${queryString}</span>`;
  searchList.forEach((item: any) => {
    item.news_title = item.news_title.replace(queryString, newHtml);
    item.news_desc = item.news_desc.replace(queryString, newHtml);
  });
  clearTimeout(timeout as any);
  timeout = setTimeout(() => {
    cb(searchList);
  }, 1000 * Math.random()) as any;
};
//解决 clearable 搜索框后再次输入不显示下拉
const searchHandle = () => {
  const autocomplete = getCurrentInstance()?.refs.autocomplete;
  if (autocompleteFlag) {
    (autocomplete as any).activated = true;
  }
};
//新闻列表选项卡切换
const handleClick = (tab: string, event: Event) => {
  getNewsItems();
};
//页数切换
const handleCurrentChange = (val: number) => {
  getNewsItems();
};
//根据新闻 类型、日期 查询新闻，并按日期排序
const getNewsItems = async () => {
  const { data: res } = await newsApi.getNewsItems(pageInfo);
  if (res.status !== 200) {
    newsItems = {};
  } else {
    newsItems = res.data;
    if ((newsItems as any).total <= (newsItems as any).limit) {
      singlePage = true;
    }
  }
};
//by date
const searchByDate = (data: any) => {
  getNewsItems();
};
//获得推荐的新闻
const getRecomNews = async () => {
  const { data: res } = await newsApi.getRecommendNews();
  if (res.status !== 200) {
    recomNews = [];
  } else {
    recomNews = res.data.list;
  }
};
//挂载前
onBeforeMount(() => {
  getNewsItems();
  getRecomNews();
});
//挂载后
onMounted(() => {
  //   const store = useStore();
  store.commit("setHeaderLogo", false);
  store.commit("setShadowActive", false);
  store.commit("setNavDarkActive", true);
  store.commit("setHeaderShow", false);
});
//离开组件
onBeforeRouteLeave((to, from, next) => {
  //   const store = useStore();
  if (from.name === "news") {
    store.commit("setNavDarkActive", false);
    store.commit("setHeaderLogo", true);
  }
  next();
});
</script>

<style lang="scss" scoped>
$hover_color: #3370ff;
* {
  margin: 0;
  padding: 0;
}

.news_header {
  background-color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(10px);
  /*border-bottom: 1px solid #eff0f1;*/
}

.box {
  padding-top: 60px;
  //background: url("../../assets/img/news/bg_02.jpg");
  //background-size: cover;
}

.news-banner {
  width: 100%;
  height: 280px;
  background: url("../../assets/img/news/newsbanner.jpg") 50% no-repeat;
  background-size: cover;
  text-align: center;
  padding-top: 70px;

  .banner-title {
    padding-bottom: 30px;

    h2 {
      font-size: 40px;
      line-height: 60px;
      font-weight: 600;
    }

    h3 {
      color: #828282;
      margin-top: 5px;
      font-size: 100%;
      font-weight: 400;
      font-variant: normal;
    }
  }

  .search-news {
    width: 46%;

    .el-input__icon {
      line-height: 46px;
      font-size: 16px;
    }
  }

  :deep .el-input__inner {
    height: 46px;
    line-height: 46px;
    border-radius: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  }
}

.news-container {
  max-width: 1200px;
  //background: #d3dce6;
  min-height: 580px;
  margin: 0 auto;

  .news-card {
    padding-top: 40px;
    margin: 0 auto 50px auto;
    display: flex;
    justify-content: space-evenly;
    //background-color: #d3dce6;
    .el-card {
      width: 280px;
      height: 160px;
      overflow: hidden;
      color: #ffffff;
    }

    .news-card-item {
      width: 280px;
      height: 160px;
      position: relative;
      cursor: pointer;

      .item-mask {
        position: absolute;
        background: linear-gradient(transparent, #030822);
        left: 0;
        bottom: 0;
        width: 100%;
        padding: 50px 20px;
        height: 97px;
        box-sizing: border-box;
      }

      span {
        color: #fff;
        text-align: left;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }

    .news-card-item:hover img {
      transform: scale(1.02);
    }

    :deep .el-card__body {
      padding: 0;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: all 0.4s ease-in-out;
    }
  }

  .news-list {
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .news-list:after {
    content: "";
    position: absolute;
    left: 0;
    top: 43px;
    width: 100%;
    height: 2px;
    background-color: #e4e7ed;
    z-index: 1;
  }

  :deep .el-tabs__header {
    height: 60px;
  }

  :deep .el-tabs__active-bar {
    bottom: 5px;
    //height: 3px;
  }

  :deep .el-tabs__item {
    height: 50px;
    line-height: 50px;
    font-weight: 600;
  }

  .list-left {
    width: 860px;

    :deep .el-tabs__content {
      height: auto;
      //background-color: #d2d3d4;
    }
  }

  .el-pagination {
    display: flex;
    justify-content: center;
    margin-top: 30px;
    margin-bottom: 50px;
  }

  .list-right {
    margin-left: 50px;

    .search-by-date {
      //padding: 6px 0;
      display: flex;
      height: 50px;
      align-items: center;
      justify-content: flex-end;
      font-size: 14px;
      margin-bottom: 25px;

      p {
        white-space: nowrap;
        position: relative;
        //right: -30px;
      }

      .el-date-editor.el-input {
        width: 160px;
      }

      :deep .el-input__inner {
        width: 160px;
        height: 30px;
        line-height: 30px;
      }

      :deep .el-input__prefix,
      :deep .el-input__suffix {
        top: -4px;
      }

      ///deep/ .el-input__suffix{
      //  right: 50px;
      //}
    }

    :deep .el-card__body {
      padding-top: 0;
    }
  }
}

:deep .el-tabs__nav-wrap::after {
  content: none;
}

.box-card {
  width: 480px;
}
</style>
<style lang="scss">
$hover_color: #3370ff;
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .desc {
      font-size: 12px;
      color: #b4b4b4;
    }

    &.highlighted {
      background: #edf6ff !important;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }

  a {
    color: rgba(0, 0, 0, 1);
    //transition: color .3s;
    display: block;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  a:hover {
    color: $hover_color;
  }
}

.el-autocomplete-suggestion li:hover {
  background-color: #edf6ff !important;
}
</style>
