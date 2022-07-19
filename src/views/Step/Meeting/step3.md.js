export default `
\`\`\`javascript
const { code, room, userIds, tracks } = await rtcClient.joinRTCRoom('roomId')

// 若加入失败，则 room、userIds、tracks 值为 undefined
if (code !== RCRTCCode.SUCCESS) {
  console.log('join living room failed:', code)
  return
}
\`\`\`
`;