<script setup>
import { inject, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  userId,
  initIM,
  connect,
  disconnect,
  connected,
  connecting,
  disconnected,
} from '../../services/im';

const router = useRouter();

const appKey = inject('appKey');
const updateAppKey = inject('updateAppKey');

const token = inject('token');
const updateToken = inject('updateToken');

const mediaServerUrl = inject('mediaServerUrl');
const updateMediaServerUrl = inject('updateMediaServerUrl');

const naviUrl = inject('naviUrl');
const updateNaviUrl = inject('updateNaviUrl');

const sdpSemantics = inject('sdpSemantics');
const updateSdpSemantics = inject('updateSdpSemantics');

const step = '第一步，建立连接。';

const getStoreUserList = () => {
  return JSON.parse(localStorage.getItem('__user_list__')) || [];
};
const setStoreUserList = () => {
  const label = `${loginForm.appKey}-${userId.value}`;
  const value = `${loginForm.appKey}__${loginForm.mediaServerUrl}__${loginForm.naviUrl}__${loginForm.token}`;
  const site = userList.findIndex(user => user.label === label);
  
  if (site === -1) {
    userList.push({
      label,
      value,
    });
  } else {
    userList[site] = { label, value };
  }
  localStorage.setItem('__user_list__', JSON.stringify(userList));
};
const userList = getStoreUserList();

const historyLoginUsers = reactive(userList);
const sdpSemanticsList = [
  {
    label: 'unified-plan',
    value: 'unified-plan'
  }, {
    label: 'plan-b',
    value: 'plan-b'
  }
];
const loginFormRef = ref();
let loginForm = reactive({
  user: '',
  appKey: '',
  token: '',
  mediaServerUrl: '',
  naviUrl: '',
  sdpSemantics: sdpSemantics.value
});
const loginFormRules = {
  appKey: [
    {
      required: true,
      message: '请输入AppKey！',
      trigger: 'blur'
    }
  ],
  token: [
    {
      required: true,
      message: '请输入Token！',
      trigger: 'blur'
    }
  ]
};

const submitLoginForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      initIM(loginForm.appKey, loginForm.mediaServerUrl, loginForm.naviUrl);
      const res = await connect(loginForm.token);
      if (res) {
        ElMessage({
          message: '连接成功',
          type: 'success',
        });
        updateAppKey(loginForm.appKey);
        updateToken(loginForm.token);
        updateMediaServerUrl(loginForm.mediaServerUrl);
        updateNaviUrl(loginForm.naviUrl);
        setStoreUserList();
      }
    } else {
      console.log('error submit!', fields);
    }
  })
};
const resetLoginForm = async () => {
  await disconnect();
  loginForm = reactive({
    user: '',
    appKey: '',
    token: '',
    mediaServerUrl: '',
    naviUrl: '',
    sdpSemantics: sdpSemanticsList[0].value
  });
};
const setLoginForm = (val) => {
  const [appKey, mediaServerUrl, naviUrl, token] = val.split('__');
  loginForm.appKey = appKey
  loginForm.mediaServerUrl = mediaServerUrl
  loginForm.naviUrl = naviUrl
  loginForm.token = token
};

const nextStep = () => {
  router.push({
    path: '/choose-scene'
  });
};
</script>

<template>
  <div class="setp1">
    <el-divider content-position="center" border-style="dotted">{{ step }}</el-divider>
    <el-form
      ref="loginFormRef"
      label-position="right"
      label-width="150px"
      :model="loginForm"
      :rules="loginFormRules"
      class="form"
    >
      <el-form-item label="User">
        <el-select v-model="loginForm.user" class="user" placeholder="请选择存储的用户" @change="setLoginForm">
          <el-option 
            v-for="user in historyLoginUsers"
            :key="user.value"
            :label="user.label"
            :value="user.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="AppKey"  prop="appKey">
        <el-input v-model="loginForm.appKey" placeholder="请输入AppKey" />
      </el-form-item>
      <el-form-item label="Token" prop="token">
        <el-input v-model="loginForm.token" placeholder="请输入Token" />
      </el-form-item>
      <el-form-item label="Media Server Url">
        <el-input v-model="loginForm.mediaServerUrl" placeholder="请输入 Media Server 地址（非必填）" />
      </el-form-item>
      <el-form-item label="Get Nav Url">
        <el-input v-model="loginForm.naviUrl" placeholder="请输入 Nav 获取地址（非必填）" />
      </el-form-item>
      <el-form-item label="SdpSemantics">
        <el-select v-model="loginForm.sdpSemantics" class="sdp" placeholder="请选择SDP格式" @change="updateSdpSemantics">
          <el-option 
            v-for="sdpSemantics in sdpSemanticsList"
            :key="sdpSemantics.value"
            :label="sdpSemantics.label"
            :value="sdpSemantics.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitLoginForm(loginFormRef)">创建连接</el-button>
        <el-button type="primary" :disabled="!connected" @click="nextStep">下一步</el-button>
        <el-button :disabled="!connected" @click="resetLoginForm">断开连接</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
.setp1 {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .form {
    width: 800px;

    .user, .sdp {
      width: 100%;
    }
  }
}
</style>