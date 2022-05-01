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
              :cityList="this.location_code_list"
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
import {ref,onMounted,onBeforeMount,getCurrentInstance} from "vue";
import { ElTree } from 'element-plus'
import useJobApi  from "../../apis/job";
import Header from "../../components/web/layout/Header.vue";
import Footer from "../../components/web/layout/Footer.vue";
import CheckboxAndDropdown from "../../components/web/CheckboxAndDropdown.vue";

const jobApi=useJobApi();

//TODO:抽离 scrollHandle到全局
const scrollHandle=()=>{

}

let results=$ref<any>([]);
let queryFilter=$ref({});
let loading=$ref(false);
let singlePage=$ref(false);
//请求获得职位列表
const getJobList=async()=>{
    results=[];
     const {data:res} =await jobApi.getJobList(queryFilter);
     //TODO: 优化此处的接口请求
     if(res.status=== 200){
         results=res.data;
         loading=false;
         if(results.total <=results.limit  ){
             singlePage=true;
         }
     }
}

let jobCities=$ref([]);
let jobCategories=$ref([]);
const getJobConfigRequest=async ()=>{
    const {data:res} =await jobApi.getJobFilters();
    if(res.status==200){
        jobCities=res.data.city_list;
        jobCategories=res.data.job_type_list;
    }
}

let job_category_id_list=$ref([]);
let jobCategory=$ref<null | HTMLElement>(null);
const jobCategoryChange=()=>{
    const vm=getCurrentInstance();
    job_category_id_list=(jobCategory as any)?.getCheckedKeys({
        leafOnLy:true
    });
    getJobList();
}

let location_code_list=$ref([]);
//设置城市
const cityChange=(value?:any)=>{
    location_code_list=value;
    getJobList();
}


onBeforeMount(()=>{
    getJobConfigRequest();
    getJobList();
})
onMounted(() => {
}),
</script>
