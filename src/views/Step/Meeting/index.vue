<script setup>
import { reactive, ref } from 'vue';
import Step from '../step.vue';
import stepInfo1 from './step1.md';
import stepInfo2 from './step2.md';
import stepInfo3 from './step3.md';
import stepInfo4 from './step4.md';
import stepInfo5 from './step5.md';
import stepInfo6 from './step6.md';
import stepInfo7 from './step7.md';
import stepInfo8 from './step8.md';

const stepInfo = reactive([
  {
    title: '引入SDK',
    text: stepInfo1
  },
  {
    title: '初始化SDK',
    text: stepInfo2
  },
  {
    title: '加入房间',
    subTitle: '根据需求选择对应加入房间的方法',
    text: stepInfo3
  },
  {
    title: '添加监听器',
    subTitle: '根据需求选择对应监听器',
    text: stepInfo4
  },
  {
    title: '订阅资源&取消订阅资源',
    text: stepInfo5
  },
  {
    title: '创建资源',
    text: stepInfo6
  },
  {
    title: '发布资源&取消发布资源',
    text: stepInfo7
  },
  {
    title: '退出房间',
    text: stepInfo8
  },
]);
const step = '接入步骤';
let active = ref(0);
const stepCount = 8;

const prevStep = () => {
  console.log(active.value)
  active.value > 0 && active.value --;
};
const nextStep = () => {
  console.log(active.value)
  active.value < stepCount - 1 && active.value ++;
};
</script>

<template>
  <el-divider content-position="center" border-style="dotted">{{ step }}</el-divider>
  <el-steps :active="active" finish-status="success" align-center>
    <el-step v-for="step in stepCount" :title="'第' + step + '步'" />
  </el-steps>
  <Step :title="stepInfo[active].title" :text="stepInfo[active].text" :sub-title="stepInfo[active].subTitle"></Step>
  <el-button type="primary" @click="prevStep">上一步</el-button>
  <el-button type="primary" @click="nextStep">下一步</el-button>
</template>

<style></style>