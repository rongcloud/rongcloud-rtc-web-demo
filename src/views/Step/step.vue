<script setup>
import showdown from 'showdown';
import { watchEffect, ref } from 'vue';

const props = defineProps({
  text: String,
  title: String,
  subTitle: String
});

const converter = new showdown.Converter();
let html = ref(converter.makeHtml(props.text));
watchEffect(() => {
  html.value = converter.makeHtml(props.text);
});
</script>

<template>
  <el-result
    icon="success"
    :title="props.title"
    :sub-title="props.subTitle"
  >
    <template #extra>
      <div class="content" v-html="html"></div>
    </template>
  </el-result>
</template>

<style lang="scss" scoped>
.content {
  text-align: left;

  :deep(pre) {
    max-width: 680px;
    background: #000;
    color: #fff;
    font-size: 16px;
    padding: 20px;
    line-height: 30px;
    font-weight: 900;
    overflow: auto;
  }
}
</style>