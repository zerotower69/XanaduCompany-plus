<script setup lang="ts">
import { defineProps, getCurrentInstance, computed } from "vue";
interface Props {
  data: Array<any>;
  cityList: Array<string>;
}
const props = defineProps<Props>();

let checked_list = $ref([]);
//handle select
const handleSelect = () => {
  const vm = getCurrentInstance();
  vm?.emit("changed", checked_list);
};

let hiddenData = $ref<Array<any>>([]);
const showHiddenData = () => {
  if (props.data?.length ?? 0 >= 6) {
    hiddenData = props.data?.splice(5, props.data.length - 1);
  }
};
let focusing = $ref(false);
const onInputBlur = (e: Event) => {
  setTimeout(() => {
    focusing = false;
  }, 200 * Math.random());
};

let targets = $ref([]);
let filterKeyword = $ref("");
const addToTarget = (command: any) => {
  if (command.code) {
    targets.push(command.code as never);
    checked_list.push(command.code as never);
    const vm = getCurrentInstance();
    vm?.emit("changed", checked_list);
  }
  filterKeyword = "";
};

const search_el_icon = () => {
  return focusing ? "el-icon-search" : "el-icon-plus";
};
const placeholder = computed(() => (focusing ? "搜索" : "更多"));
//用来渲染默认展开的列表
const targetData = computed(() =>
  targets
    .map((key) => {
      return props.data.find((item) => item.code === key);
    })
    .filter((item) => item && item.code)
);
const sourceData = computed<Array<any>>(() =>
  props.data.filter((item) => targets.indexOf(item.code as never) === -1)
);
//渲染搜索的结果
const filterableData = computed(() =>
  //@ts-ignore
  sourceData.filter((item) => item.name.startsWith(filterKeyword))
);
</script>
<style lang="scss">
.el-dropdown {
  input::placeholder {
    color: $main-color;
  }

  .el-input__icon {
    color: $main-color;
  }

  .focusing {
    input::placeholder {
      color: $secondary-text-color;
    }

    .el-input__icon {
      color: $secondary-text-color;
    }
  }
}
</style>
<style lang="scss" scoped>
:deep .el-checkbox-group {
  display: flex;
  flex-direction: column;

  .el-checkbox {
    height: 38px;
    line-height: 38px;
  }

  > .el-checkbox:first-child {
    margin-top: 8px;
  }

  .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }

  .el-checkbox__label {
    font-size: 16px;
  }
}

:deep .el-input {
  .el-input__inner {
    border: none;
  }

  .el-input__inner:hover {
    border: none;
  }

  .el-input__prefix {
    left: 0;
  }

  .el-input__icon {
    font-size: 16px;
    width: 0;
  }
}

.el-dropdown {
  //position: relative;
  //width: 200px;
}

:focus {
  outline: none;
}
</style>
