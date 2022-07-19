<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import rtc from '../../services/rtc';

rtc.initRTCClient();

const router = useRouter();

const appKey = inject('appKey');
const token = inject('token');
const mediaServerUrl = inject('mediaServerUrl');
const naviUrl = inject('naviUrl');

const step = '第二步，选择场景。';
const sceneList = [
  {
    label: '音视频会议',
    value: '/scene/meeting'
  },
  {
    label: '直播-主播端',
    value: '/scene/living-anchor'
  },
  {
    label: '直播-观众端',
    value: '/scene/living-audience'
  },
  // {
  //   label: '进阶应用',
  //   value: '/upgrade'
  // },
];
const scene = ref(sceneList[0].value);
const nextStep = () => {
  router.push({
    path: scene.value
  });
};
</script>

<template>
<div class="step2">
  <el-divider content-position="center" border-style="dotted">{{ step }}</el-divider>
  <el-form
    label-position="right"
    label-width="150px"
    class="form"
  >
    <el-form-item label="场景">
      <el-select v-model="scene" class="scene">
        <el-option
          v-for="scene in sceneList"
          :key="scene.value"
          :label="scene.label"
          :value="scene.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="nextStep">下一步</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<style lang="scss" scoped>
.step2 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .form {
    width: 800px;

    .scene {
      width: 100%;
    }
  }
}
</style>