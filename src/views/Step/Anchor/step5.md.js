export default `
#### 资源订阅
\`\`\`javascript
const { code } = await room.subscribe(tracks)
if (code !== RCRTCCode.SUCCESS) {
  console.log('资源订阅失败 ->', code)
}
\`\`\`
#### 取消订阅
\`\`\`javascript
const { code } = await room.unsubscribe(tracks)
if (code !== RCRTCCode.SUCCESS) {
  console.log('资源取消订阅失败 ->', code)
}
\`\`\`
#### 资源播放
\`\`\`javascript
// 播放视频需要将 <video> 标签传递给 videoTrack 实例
track.play(videoNode)

// 播放音频时无需传参，尽量不要在本端播放本端采集的音频流，因为可能会引起回声问题
track.play()
\`\`\`
`;