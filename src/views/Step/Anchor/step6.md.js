export default `
#### 由麦克风捕获音频流
\`\`\`javascript
const { code, track: audioTrack } = await rtcClient.createMicrophoneAudioTrack()
\`\`\`
#### 由摄像头捕获视频流
\`\`\`javascript
const { code, track: videoTrack } = await rtcClient.createCameraVideoTrack()
\`\`\`
#### 同时捕获音视频流
\`\`\`javascript
const { code, tracks } = await rtcClient.createMicrophoneAndCameraTracks()

if (code === RCRTCCode.SUCCESS) {
  // tracks 包含一个 RCMicphoneAudioTrack 实例和一个 RCCameraVideoTrack 实例
  const [ audioTrack, videoTrack ] = tracks
}
\`\`\`
`;