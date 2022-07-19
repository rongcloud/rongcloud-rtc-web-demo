<script setup>
import { inject, reactive } from 'vue';
import Layout from './layout.vue';

const roomData = inject('roomData');
const setBitrate = () => {
  roomData.tracks[1].setBitrate(form.maxBitrate, form.minBitrate, form.startBitrate);
};

const form = reactive({
  maxBitrate: 300,
  minBitrate: 1,
  startBitrate: 140
});
</script>

<template>
<Layout>
  <template #handler>
    <el-form :model="form" label-position="top" style="width: 100%;">
      <el-form-item label="最大上行码率">
        <el-input v-model="form.maxBitrate" placeholder="不可小于200且不可小于最小上行码率" type="number" />
      </el-form-item>
      <el-form-item label="最小上行码率">
        <el-input v-model="form.minBitrate" placeholder="默认值为1且不可大于最大上行码率" type="number" />
      </el-form-item>
      <el-form-item label="起始码率">
        <el-input v-model="form.startBitrate" placeholder="默认值为码率上限的70%" type="number" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="setBitrate">设置码率</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template #result>
    <div>结果</div>
  </template>
</Layout>
</template>

<style lang="scss" scoped>
</style>