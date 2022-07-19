import { ref } from 'vue'

const defaultAppkey = ''
const defaultNavi = ''
const defaultToken = ''
const defaultMS = ''
const defaultSdpSemantics = 'unified-plan'

// appkey
const APP_KEY = ref(defaultAppkey)
// media-server 地址，值为空时将使用导航下发地址
const MS_URL = ref(defaultMS)
// 导航请求地址
const NAVI_URL = ref(defaultNavi)
// 用户 token
const TOKEN = ref(defaultToken)
// sdp方式
const SDP_SEMANTICS = ref(defaultSdpSemantics)

export {
  APP_KEY,
  MS_URL,
  NAVI_URL,
  TOKEN,
  SDP_SEMANTICS
}
