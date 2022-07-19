export default `
\`\`\`javascript
import { RCLivingType } from '@rongcloud/plugin-rtc'

// 从 5.2.3 开始，加入房间时可返回 RTCTracks、MCUTracks、CDNUris、userIds
const { room, RTCTracks, MCUTracks, CDNUris, userIds, code } = await rtcClient.joinLivingRoomAsAudience('roomId', RCLivingType.AUDIO_VIDEO)
// 若加入失败，则 room 值为 undefined
if (code !== RCRTCCode.SUCCESS) {
  console.log('join room as audience failed:', code)
}
\`\`\`
`;