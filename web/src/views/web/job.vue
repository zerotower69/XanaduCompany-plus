<template>
  <div class="job">
    <Header class="job_header" ref="job_header"></Header>
    <div class="box">
      <div class="banner">和优秀的人，做有挑战的事</div>
      <!-- 搜索 -->
      <div class="search-wrapper" :class="{ fixedTop: searchBarFixedTop }">
        <el-input
          :class="[{ medium: searchBarFixedTop }, 'small']"
          placeholder="搜索职位"
          @change="search"
          v-model="searchKeyword"
        >
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
        <el-button
          :class="[{ medium: searchBarFixedTop }, 'small']"
          type="primary"
          round
          @click="search"
          >搜索
        </el-button>
      </div>
      <div class="main">
        <div class="aside-filter">
          <div class="aside-header">
            <span>筛选</span>
            <span :class="{ clearable }" class="clear" @click="clearFilter"
              >清空</span
            >
          </div>
          <div class="job-category job-filter-block">
            <div class="title">职位类别</div>
            <el-tree
              ref="jobCategory"
              :data="jobCategories"
              :props="jobCategoryProps"
              node-key="id"
              check-on-click-node
              @check="jobCategoryChange"
              show-checkbox
            >
            </el-tree>
          </div>
          <div class="city-category job-filter-block">
            <div class="title">城市</div>
            <checkbox-and-dropdown
              @changed="cityChange"
              :data="jobCities"
              :cityList="location_code_list"
              >{{ location_code_list }}
            </checkbox-and-dropdown>
          </div>
        </div>
        <div class="content">
          <h2 class="content-title" v-show="results.total > 0">
            开启新的工作 ({{ results.total }})
          </h2>
          <h2 class="content-title" v-show="!results.total > 0">
            开启新的工作 (0)
          </h2>
          <ul class="content-list">
            <li
              class="content-item is-hover-shadow"
              v-for="item in results.job_post_list"
              :key="item.id"
            >
              <router-link :to="`/job/${item.id}`">
                <h3 class="title">{{ item.title }}</h3>
                <div class="subTitle">
                  <span class="city">{{ item.aw_city_info.name }}</span
                  >&nbsp;|
                  <span class="job_category">{{
                    item.aw_job_category.name
                  }}</span>
                </div>
                <p class="desc">{{ item.description }}</p>
              </router-link>
            </li>
          </ul>
          <div v-show="!loading" class="pagination-wrapper">
            <el-pagination
              layout="prev, pager, next"
              :current-page.sync="currentPage"
              :total="results.total"
              :hide-on-single-page="singlePage"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeMount, getCurrentInstance } from "vue";
import { useStore } from "vuex";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import useJobApi from "../../apis/job";
import Header from "../../components/web/layout/Header.vue";
import Footer from "../../components/web/layout/Footer.vue";
import CheckboxAndDropdown from "../../components/web/CheckboxAndDropdown.vue";

//data computed

// let jobCategories=$ref([]);
let jobCategoryProps = $ref({
  children: "children",
  label: "name",
});
// let jobCities=$ref([]);
let searchBarFixedTop = $ref(false);
// let searchKeyword=$ref("");
// let currentPage=$ref(1);
let pageSize = $ref(10);
let cityList = $ref([]);
let cities = $ref([]);
// let results=$ref([]);
// let loading=$ref(false);
let locationCodeProps = $ref({
  label: "name",
});
// let singlePage = $ref("");
let checked = $ref(false);

const queryFilter = computed(() => {
  return {
    job_category_id_list,
    location_code_list,
    keyword: searchKeyword,
    pageSize,
    currentPage,
  };
});

const clearable = computed(() => {
  return {
    job_category_id_list,
    location_code_list,
  };
});

const jobApi = useJobApi();

//TODO:抽离 scrollHandle到全局
const scrollHandle = () => {};

//搜索
const search = () => {
  getJobList();
};

let searchKeyword = $ref("");

let results = $ref<any>([]);
let loading = $ref(false);
let singlePage = $ref(false);
//请求获得职位列表
const getJobList = async () => {
  results = [];
  const { data: res } = await jobApi.getJobList(queryFilter);
  //TODO: 优化此处的接口请求
  if (res.status === 200) {
    results = res.data;
    loading = false;
    if (results.total <= results.limit) {
      singlePage = true;
    }
  }
};

let jobCities = $ref([]);
let jobCategories = $ref([]);
const getJobConfigRequest = async () => {
  const { data: res } = await jobApi.getJobFilters();
  if (res.status == 200) {
    jobCities = res.data.city_list;
    jobCategories = res.data.job_type_list;
  }
};

let job_category_id_list = $ref([]);
let jobCategory = $ref<null | HTMLElement>(null);
const jobCategoryChange = () => {
  const vm = getCurrentInstance();
  job_category_id_list = (jobCategory as any)?.getCheckedKeys({
    leafOnLy: true,
  });
  getJobList();
};

let location_code_list = $ref([]);
//设置城市
const cityChange = (value?: any) => {
  location_code_list = value;
  getJobList();
};
//清除过滤条件
const clearFilter = () => {
  if (job_category_id_list.length) {
    job_category_id_list = [];
    const jobCategory = getCurrentInstance()?.refs.jobCategory;
    (jobCategory as any).setCheckedKeys(job_category_id_list, {
      leafOnly: true,
    });
  }
  if (location_code_list.length) {
    location_code_list = [];
  }
};

let currentPage = $ref(1);

onBeforeMount(() => {
  //挂载前加载数据
  getJobConfigRequest();
  getJobList();
});
onMounted(() => {
  //设置全局状态
  const store = useStore();
  store.commit("setHeaderLogo", false);
  store.commit("setShadowActive", false);
  store.commit("setNavDarkActive", true);
  store.commit("setHeaderShow", false);
}),
  //离开组件路由
  onBeforeRouteLeave((to, from, next) => {
    const store = useStore();
    if (from.name === "job") {
      store.commit("setNavDarkActive", false);
      store.commit("setHeaderLogo", true);
      next();
    }
  });
</script>

<style lang="scss" scoped>
.job_header {
  background-color: rgba(255, 255, 255, 1);
  backdrop-filter: blur(10px);
}

.box {
  padding-top: 60px;
  min-height: 860px;
  width: 100%;

  * {
    box-sizing: border-box;
  }

  .banner {
    height: 400px;
    line-height: 400px;
    color: #fff;
    width: 100%;
    min-width: $main-width;
    background-image: url("//sf1-ttcdn-tos.pstatp.com/obj/ttfe/ATSX/mainland/joblistbanner2x.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    text-align: center;
    font-size: $font-size-larger;
  }
}

.search-wrapper {
  position: absolute;
  transform: translateY(-50%);
  width: 100%;

  &.fixedTop {
    position: fixed;
    box-shadow: 0 2px 16px 0 rgba(31, 35, 41, 5%);
    top: 0;
    transform: translateY(0);
    padding: 15px 0;
    z-index: 1000;
    background-color: #fff;
    transition: all 0.3s;
  }

  .el-input {
    width: 50%;
    left: 50%;
    transform: translateX(-50%);

    &.medium {
      width: 64%;
    }
  }

  /deep/ .el-input__inner {
    height: 50px;
    border-radius: 25px;
  }

  .el-button {
    position: absolute;
    line-height: 0;
    height: 50px;
    border-radius: 0 25px 25px 0;
    right: 25%;

    &.medium {
      right: 18%;
    }
  }
}

.main {
  width: 1026px;
  min-height: 400px;
  margin: 80px auto 60px;
  display: flex;

  .aside-filter {
    width: 275px;
    height: auto;
    padding-right: 35px;
    border-right: 1px solid $border-light-color;
  }

  .aside-header {
    font-size: 14px;
    font-weight: 700;
    color: #1f2329;
    border-bottom: 1px solid $border-lighter-color;
    padding-bottom: 12px;
    margin-top: 10px;
    margin-bottom: 23px;

    .clear {
      float: right;
      font-weight: normal;
      cursor: pointer;
    }

    .clearable {
      color: $main-color;
    }
  }

  .job-filter-block {
    margin-bottom: 39px;
    position: relative;
    height: auto;

    .title {
      font-size: 20px;
      font-weight: 700;
      color: $primary-text-color;
      margin-bottom: 9px;
    }
  }

  .content {
    width: 712px;
    height: auto;
    //margin-left: 300px;

    padding-left: 24px;
  }

  .content-title {
    font-size: 30px;
    line-height: 36px;
    height: 36px;
    font-weight: 700;
    margin-left: 16px;
    margin-bottom: 18px;
  }

  .content-list {
    margin-top: 22px;
  }

  .content-item {
    //margin-bottom: 20px;
    padding: 20px;
    transition: box-shadow 0.5s;

    &.is-hover-shadow:hover {
      box-shadow: 0 8px 24px 0 rgba(187, 191, 196, 0.2);
      border-radius: 5px;
    }

    .title {
      margin: 12px 0;
      font-size: 20px;
      font-weight: 600;
      line-height: 1.6;
    }

    .subTitle {
      flex-wrap: wrap;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
      color: #646a73;
      margin: 4px 0 12px;
    }

    .desc {
      width: 664px;
      max-height: 44px;
      font-size: 14px;
      font-weight: 500;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.57;
      letter-spacing: normal;
      color: #8f959e;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      white-space: pre-line;
      -webkit-line-clamp: 2;
    }
  }

  a {
    color: rgba(0, 0, 0, 1);
    overflow: hidden;
    cursor: pointer;
  }
}
</style>
<style lang="less">
.el-tree {
  color: @primary-text-color;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  list-style: none;
  -webkit-font-feature-settings: "tnum";
  font-feature-settings: "tnum";
  margin: 0;
  padding: 0;

  > .el-tree-node:first-child {
    margin-top: 8px;
  }

  .el-tree-node__content {
    height: 38px;
  }

  .el-tree-node__label {
    font-size: 16px;
  }

  .el-tree-node__expand-icon {
    color: #9ca2a9;
  }
}

.el-pagination {
  margin-top: 20px;
}
</style>
