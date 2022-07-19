export default `
\`\`\`javascript
// 注册房间事件监听器，重复注册时，仅最后一次注册有效
room.registerRoomEventListener({
  onKickOff (byServer) {},
  onMessageReceive (name, content, senderUserId, messageUId) {},
  onRoomAttributeChange (name, content) {},
  onAudioMuteChange (audioTrack) {},
  onVideoMuteChange (videoTrack) {},
  async onTrackPublish (tracks) {
    // 按业务需求选择需要订阅资源，通过 room.subscribe 接口进行订阅
    const { code } = await room.subscribe(tracks)
    if (code !== RCRTCCode.SUCCESS) {
      console.log('资源订阅失败 ->', code)
    }
  },
  onTrackUnpublish (tracks) {},
  onTrackReady (track) {
    if (track.isAudioTrack()) {
      // 音轨不需要传递播放控件
      track.play()
    } else {
      // 视轨需要一个 video 标签才可进行播放
      const element = document.createElement('video')
      document.body.appendChild(element)
      track.play(element)
    }
  },
  onUserJoin (userIds) {},
  onUserLeave (userIds) {},
  onSwitchRole (userId, role) {}
})
\`\`\`
`;