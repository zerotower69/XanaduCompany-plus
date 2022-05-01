<template>
  <div class="checkbox">
    <h2>{{ title }}</h2>

    <ul class="checkbox-list">
      <li
        class="checkbox-item"
        v-for="(item, index) in targetData"
        :key="index"
      >
        <input
          @change="check(item, $event)"
          type="checkbox"
          :id="item[props.key]"
          :checked="checked[index]"
        />
        <label :for="item[props.key]" class="label-text">
          {{ item[props.label] }}
        </label>
      </li>
    </ul>
    <div class="search" v-if="sourceData.length">
      <input
        @blur="onInputBlur"
        @focus="focusing = true"
        class="search-input"
        :class="{ focusing }"
        :placeholder="placeholder"
        type="text"
        v-model="filterKeyword"
      />
      <ul class="search-list" v-show="focusing">
        <li
          v-for="item in filterableData"
          :key="item[props.key]"
          class="search-item"
          @click="addToTarget(item)"
        >
          <span>{{ item[props.label] }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  defineProps,
  withDefaults,
  computed,
  watch,
  defineEmits,
  getCurrentInstance,
} from "vue";
interface Props {
  title: string;
  targetCount?: number;
  data?: Array<any>;
  props?: {
    key: "key";
    label: "label";
  };
  value?: Array<any>;
}
const props = withDefaults(defineProps<Props>(), {
  targetCount: 5,
  data: () => [],
  props: () => {
    return {
      key: "key",
      label: "label",
    };
  },
  value: () => [],
});
//props

//data
let focusing = $ref(false);
let filterKeyword = $ref("");
let targets = $ref<
  Array<{
    key: string;
    label: string;
  }>
>([]);

//computed
const checked = computed(() => targets.map((key) => props.value.includes(key)));
const targetData = computed(() =>
  targets
    .map((key) => props.data.find((item) => item[props.props.key] === key))
    .filter((item) => item && item[props.props.key])
);
const sourceData = computed<Array<any>>(() =>
  props.data.filter((item) => targets.indexOf(item[props.props.key]) === -1)
);
const filterableData = computed(() =>
  //@ts-ignore
  sourceData.filter((item) => {
    return item[props.props.key].startsWith(filterKeyword);
  })
);

const placeholder = computed(() => (focusing ? "更多" : "搜索"));

const vm = getCurrentInstance();

const emitChecked = defineEmits<{
  (e: "change", value: any): void;
}>();
watch(checked, (val) => {
  //   emitChecked("change", val);
  vm?.emit("change", val);
});
watch(props.data, (val) => {
  targets = props.data.slice(0, 6).map((item) => item[props.props.key]);
  //@ts-ignore
  checked.length = targets.length;
  props.value.forEach((key) => {
    if (!targets.includes(key)) {
      targets.push(key);
      //@ts-ignore
      checked.push(key);
    }
  });
});

const clearChecked = () => {
  for (let i = 0, l = props.value.length; i < l; i++) {
    props.value.pop();
  }
};

const onInputBlur = (e?: Event) => {
  setTimeout(() => {
    focusing = false;
  }, 200);
};

const addToTarget = (item: any) => {
  if (item[props.props.key]) {
    targets.push(item[props.props.key]);
    props.value.push(item[props.props.key]);
  }
  filterKeyword = "";
};
const check = (item: any, e: Event) => {
  if ((e.target as HTMLInputElement).checked) {
    const delIndex = props.value.indexOf(item[props.props.key]);
    delIndex > -1 && props.value.splice(delIndex, 1);
  } else {
    !props.value.includes(item[props.props.key]) &&
      props.value.push(item[props.props.key]);
  }
  vm?.emit(
    "check",
    (e.target as HTMLInputElement).checked,
    item[props.props.key]
  );
  vm?.emit("input", props.value);
};
</script>

<style lang="scss" scoped>
.checkbox {
  max-width: 200px;

  h2 {
    font-weight: $font-weight-regular;
    margin-bottom: 12px;
    color: black;
    font-size: $font-size-large;
  }

  &-item {
    margin-bottom: 8px;
    // cursor: pointer;
    input,
    label {
      cursor: pointer;
    }

    input {
      transform: scale(1.4);
    }

    .label-text {
      margin-left: 3px;
      vertical-align: middle;
    }

    &:hover {
      border-color: $main-color;
    }
  }
}

.search {
  position: relative;

  &-placeholder {
    cursor: pointer;
    // border-bottom: 1px solid @border-lighter-color;
  }

  &-input {
    border-width: 0 0 1px 0;
    outline: none;
    width: 100%;
    padding: 5px;
    border-color: $border-lighter-color;

    &.focusing {
      border-color: $main-color;
    }
  }

  &-list {
    padding-top: 10px;
    position: absolute;

    z-index: 10000;
    background-color: #fff;
    max-height: 300px;
    width: 100%;
    overflow: auto;
    line-height: 34px;
    box-shadow: 0 10px 30px 0 rgba(136, 150, 171, 0.15);
  }

  &-item {
    padding: 0 20px;

    &:hover {
      cursor: pointer;
      background: $bg-base-color;
    }
  }
}
</style>
