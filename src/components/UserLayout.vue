<script setup>
import { provide, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { APP_KEY, MS_URL, NAVI_URL, TOKEN, SDP_SEMANTICS } from '../services/config';
import { connected, disconnected } from '../services/im';
import routes from '../routers';
import { ElMessage } from 'element-plus';

const router = useRouter();

const updateAppKey = (value) => {
  APP_KEY.value = value;
};
provide('appKey', APP_KEY);
provide('updateAppKey', updateAppKey);

const updateMediaServerUrl = (value) => {
  MS_URL.value = value;
};
provide('mediaServerUrl', MS_URL);
provide('updateMediaServerUrl', updateMediaServerUrl);

const updateNaviUrl = (value) => {
  NAVI_URL.value = value;
};
provide('naviUrl', NAVI_URL);
provide('updateNaviUrl', updateNaviUrl);

const updateToken = (value) => {
  TOKEN.value = value;
};
provide('token', TOKEN);
provide('updateToken', updateToken);

const updateSdpSemantics = (value) => {
  SDP_SEMANTICS.value = value;
};
provide('sdpSemantics', SDP_SEMANTICS);
provide('updateSdpSemantics', updateSdpSemantics);

router.beforeEach((to, from, next) => {
  if (disconnected.value) {
    if (
      [
        '/', 
        '/create-connection', 
        '/step/meeting',
        '/step/anchor',
        '/step/audience',
      ].includes(to.path)
    ) {
      next();
    } else {
      ElMessage({
        message: '请先点击开始菜单进行建立连接操作！',
        type: 'error'
      })
      next('/create-connection');
    }
    return;
  }
  next();
});
</script>

<template>
  <div class="layout">
    <div class="left">
      <el-menu
        router
        active-text-color="#ffd04b"
        text-color="#fff"
        background-color="#545c64"
      >
        <template v-for="first in routes">
          <template v-if="first.hide"></template>
          <el-sub-menu v-else-if="first.children?.length" :index="first.path">
            <template #title>{{ first.label }}</template>
            <template v-for="second in first.children">
              <el-menu-item :index="first.path + '/' + second.path">{{ second.label }}</el-menu-item>
            </template>
          </el-sub-menu>
          <el-menu-item v-else :index="first.path">{{ first.label }}</el-menu-item>
        </template>
      </el-menu>
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  padding: 0;
  display: flex;

  .left {
    width: 200px;
    min-height: 100vh;

    > ul {
      min-height: 100%;
    }
  }

  .right {
    flex-grow: 1;
  }
}
</style>
