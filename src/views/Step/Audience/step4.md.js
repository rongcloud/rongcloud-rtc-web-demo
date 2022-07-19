export default `
\`\`\`javascript
room.registerRoomEventListener({
  onAnchorJoin (userIds) {},
  onAnchorLeave (userIds) {},
  onTrackPublish (tracks) {},
  onTrackUnpublish (tracks) {},
  onAnchorTrackPublish (tracks){},
  onAnchorTrackUnpublish (tracks){},
  onTrackReady (track: RCRemoteTrack) {
    // 订阅的音视频轨道已连接，可以根据业务需求选择性播放
    if (track.isAudioTrack()) {
      // 音频播放无需传递组件
      track.play()
    } else {
      // 此处的 videoNode 为 <video> 标签元素实例
      track.play(videoNode)
    }
  }
})
\`\`\`
`;