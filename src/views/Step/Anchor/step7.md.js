export default `
#### 发布
\`\`\`javascript
const { code } = await room.publish([audioTrack, videoTrack])

// 若资源发布失败
if (code !== RCRTCCode.SUCCESS) {
  console.log('资源发布失败:', code)
}
\`\`\`
#### 取消发布
\`\`\`javascript
const { code } = await room.unpublish([audioTrack, videoTrack])

if (code !== RCRTCCode.SUCCESS) {
  console.log('取消发布失败:', code)
}

// 取消发布后，业务层若不再需要播放资源，可调 destroy 方法销毁资源
// audioTrack.destroy()
// videoTrack.destroy()
\`\`\`
`;