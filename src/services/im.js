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
    connectionState.value = RongIMLib.ConnectionStatus.CONNECTED;
  };
  const onDisconnect = () => {
    console.log('onDisconnect');
    connectionState.value = RongIMLib.ConnectionStatus.DISCONNECTED
  };
  const onConnecting = () => {
    console.log('onConnecting');
    connectionState.value = RongIMLib.ConnectionStatus.CONNECTING;
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
};

const connect = (TOKEN) => {
  return RongIMLib.connect(TOKEN).then(user => {
    userId.value = user.data.userId;
    console.log('connect success', user.data.userId);
    return true;
  }).catch(error => {
    console.error(error);
  });
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
