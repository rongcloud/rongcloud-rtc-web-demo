export default `
#### 1、[登录融云开发者后台](https://developer.rongcloud.cn/app/appkey/mAYKybm9ubTOKnmi2CRjkA)
#### 2、在服务管理 >> 基本信息 >> APP Key 页面拿到目标应用的App Key
#### 3、在项目中初始化IMLib：如下所示
\`\`\`javascript
import * as RongIMLib from '@rongcloud/imlib-next'
import { installer, RCRTCCode } from '@rongcloud/plugin-rtc'
// 初始化 IM
RongIMLib.init({
  appkey: 'App Key',
});
\`\`\`
#### 4、添加事件监听：如下所示
\`\`\`
/**
* 监听消息通知
*/
const Events = RongIMLib.Events;
RongIMLib.addEventListener(Events.MESSAGES, (event) => {
  console.log('received messages', event.messages);
});

/**
* 监听 IM 连接状态变化
*/
RongIMLib.addEventListener(Events.CONNECTING, () => {
  console.log('onConnecting');
});
RongIMLib.addEventListener(Events.CONNECTED, () => {
  console.log('onConnected');
});
RongIMLib.addEventListener(Events.DISCONNECT, () => {
  console.log('onDisconnect');
});
\`\`\`
#### 5、在项目中初始化RTCLib：如下所示
\`\`\`javascript
// 初始化 RCRTCClient，初始化过程推荐放在建立连接之前
const rtcClient = RongIMLib.installPlugin(installer, {});
\`\`\`
`;