export default `
\`\`\`javascript
import { RCLivingType } from '@rongcloud/plugin-rtc'

const { code, room, userIds, tracks, PKRoomIds } = await rtcClient.joinLivingRoom('roomId', RCLivingType.VIDEO)

// 若加入失败，则 room、userIds、tracks 值为 undefined
if (code !== RCRTCCode.SUCCESS) {
  console.log('join room failed:', code)
  return
}
\`\`\`
`;