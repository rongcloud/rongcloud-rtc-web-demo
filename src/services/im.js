import * as RongIMLib from '@rongcloud/imlib-next'
import { ref, computed } from 'vue'

// 已连接用户 Id
const userId = ref('')
const appkey = ref('')

// 连接状态
const connectionState = ref(RongIMLib.ConnectionStatus.DISCONNECTED)
// 连接中
const connecting = computed(() => connectionState.value === RongIMLib.ConnectionStatus.CONNECTING)
// 已连接
const connected = computed(() => connectionState.value === RongIMLib.ConnectionStatus.CONNECTED)
// 未连接
const disconnected = computed(() => !(connecting.value || connected.value))

// im 初始化
const initIM = (APP_KEY, NAVI_URL) => {
  appkey.value = APP_KEY

  // im 初始化
  RongIMLib.init({
    appkey: APP_KEY,
    navigators: NAVI_URL ? [NAVI_URL] : undefined,
    // logLevel: 0
  });

  const watchMessage = (msg) => { console.log('收到消息', msg); };
  const onConnected = () => {
    console.log('onConnected');
    connectionState.value = RongIMLib.RCConnectionStatus.CONNECTED;
  };
  const onDisconnect = () => {
    console.log('onDisconnect');
    connectionState.value = RongIMLib.RCConnectionStatus.DISCONNECTED
  };
  const onConnecting = () => {
    console.log('onConnecting');
    connectionState.value = RongIMLib.RCConnectionStatus.CONNECTING;
  };
  const onSuspend = (code) => {
    console.log('onSuspend', code);
    connectionState.value = RongIMLib.RCConnectionStatus.SUSPEND;
  };

  const Events = RongIMLib.Events;
  RongIMLib.addEventListener(Events.MESSAGES, function (event) {
    var messages = event.messages;
    // var hasMore = event.hasMore
    watchMessage(messages);
    console.warn('received messages', event);
  });

  RongIMLib.addEventListener(Events.CONNECTING, onConnecting);
  RongIMLib.addEventListener(Events.CONNECTED, onConnected);
  RongIMLib.addEventListener(Events.DISCONNECT, onDisconnect);
  RongIMLib.addEventListener(Events.SUSPEND, onSuspend);
};

const connect = async (TOKEN) => {
  const { code, data } = await RongIMLib.connect(TOKEN);
  if (code !== RongIMLib.ErrorCode.SUCCESS) {
    console.error('connect error', code);
    return false;
  }
  userId.value = data.userId;
  console.log('connect success', data.userId);
  return true;
};

const disconnect = () => {
  return RongIMLib.disconnect();
};

export {
  initIM,
  connect,
  disconnect,
  connected,
  connecting,
  disconnected,
  connectionState,
  userId,
  appkey,
};
