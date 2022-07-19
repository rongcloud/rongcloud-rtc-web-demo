<script setup>
import {
  RCRTCCode
} from '@rongcloud/plugin-rtc';
import { inject, reactive, ref } from 'vue';
import Layout from './layout.vue';

const roomData = inject('roomData');
const roomKey = reactive([]);
let roomAttributes = reactive({});
const setRoomAttribute = async () => {
  const { code } = await roomData.room.setRoomAttribute(form.key, form.value, isSendMessage.value ? {
    name: form.name,
    content: form.content
  } : undefined);

  if (code === RCRTCCode.SUCCESS) {
    roomKey.push(form.key);
  }
};
const getRoomAttributes = async () => {
  const {code, data} = await roomData.room.getRoomAttributes(roomKey);

  if (code === RCRTCCode.SUCCESS) {
    roomAttributes.value = data
  }
}
const deleteRoomAttributes = async () => {
  const {code} = await roomData.room.deleteRoomAttributes(roomKey);

  if (code === RCRTCCode.SUCCESS) {
    roomKey.length = 0;
  }
}

const isSendMessage = ref(false);
const form = reactive({
  key: '',
  value: '',
  name: '',
  content: ''
});
</script>

<template>
<Layout>
  <template #handler>
    <el-form :model="form" label-position="right" label-width="120px" style="width: 100%; margin-top: 50px;">
      <el-form-item label="属性名">
        <el-input v-model="form.key" />
      </el-form-item>
      <el-form-item label="属性值">
        <el-input v-model="form.value" />
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="isSendMessage" label="是否发送通知"></el-checkbox>
      </el-form-item>
      <template v-if="isSendMessage">
        <el-form-item label="通知的名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="通知的值">
          <el-input v-model="form.content" />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button type="primary" @click="setRoomAttribute">设置</el-button>
        <el-button type="primary" @click="getRoomAttributes">获取</el-button>
        <el-button type="primary" @click="deleteRoomAttributes">删除</el-button>
      </el-form-item>
    </el-form>
  </template>
  <template #result>
    <div>结果</div>
    <div>{{roomAttributes.value}}</div>
  </template>
</Layout>
</template>

<style lang="scss" scoped>
</style>