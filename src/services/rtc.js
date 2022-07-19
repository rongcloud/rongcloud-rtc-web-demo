import * as RongIMLib from '@rongcloud/imlib-next';
import {
  installer,
  RCRTCCode,
  device,
  RCLivingType
} from '@rongcloud/plugin-rtc';
import { MS_URL, SDP_SEMANTICS } from './config';

/**
 * 初始化 rtcClient
 */
let rtcClient = null;
const initRTCClient = (options) => {
  console.log(SDP_SEMANTICS);
  const { pullInnerCDNProtocol, pullInnerCDNUseHttps } = options || {};
  rtcClient = RongIMLib.installPlugin(installer, {
    mediaServer: MS_URL.value || undefined,
    timeout: 30 * 1000,
    sdpSemantics: SDP_SEMANTICS.value,
    pullInnerCDNProtocol,
    pullInnerCDNUseHttps,
  });

  return rtcClient
};

/**
 * 加入普通音视频房间
 */
const joinRTCRoom = async (roomId) => {
  const { code, room, userIds, tracks } = await rtcClient.joinRTCRoom(roomId);

  if (code !== RCRTCCode.SUCCESS) {
    console.log('join RTC room failed:', code);
    return;
  }

  return {
    room,
    userIds,
    tracks
  };
};

/**
 * 加入直播房间
 */
const joinLivingRoom = async (roomId) => {
  const { code, room, userIds, tracks, PKRoomIds } = await rtcClient.joinLivingRoom(roomId);

  if (code !== RCRTCCode.SUCCESS) {
    console.log('join RTC room failed:', code);
    return;
  }

  return {
    room,
    userIds,
    tracks,
    PKRoomIds
  };
};

/**
 * 加入直播房间(观众)
 */
const joinLivingRoomAsAudience = async (roomId) => {
  const { code, room, RTCTracks, MCUTracks, CDNUris, userIds } = await rtcClient.joinLivingRoomAsAudience(roomId, RCLivingType.AUDIO_VIDEO );

  if (code !== RCRTCCode.SUCCESS) {
    console.log('join RTC room failed:', code);
    return;
  }

  return {
    room,
    RTCTracks,
    MCUTracks,
    CDNUris,
    userIds
  };
};

/**
 * 离开直播房间
 */
const leaveLivingRoom = async (room) => {
  const { code } = await rtcClient.leaveRoom(room);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`退出房间失败 -> code: ${code}`);
  }
};

/**
 * 离开直播房间(观众)
 */
const leaveLivingRoomAsAudience = async (room) => {
  const { code } = await rtcClient.leaveLivingRoomAsAudience(room);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`退出房间失败 -> code: ${code}`);
  }
};

/**
 * 离开房间
 */
 const leaveRTCRoom = async (room) => {
  const { code } = await rtcClient.leaveRoom(room);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`退出房间失败 -> code: ${code}`);
  }
};

/**
 * 由麦克风捕获音频流
 */
const createMicrophoneAudioTrack = async (tag, options) => {
  const { code, track } = await rtcClient.createMicrophoneAudioTrack(tag, options);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`捕获音频流失败 -> code: ${code}`);
    return;
  }

  return track;
};

/**
 * 由摄像头捕获视频流
 */
const createCameraVideoTrack = async (tag, options) => {
  const { code, track } = await rtcClient.createCameraVideoTrack(tag, options);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`捕获视频流失败 -> code: ${code}`);
    return;
  }

  return track;
};

/**
 * 同时捕获音视频流
 */
const createMicrophoneAndCameraTracks = async (tag, options) => {
  const { code, tracks } = await rtcClient.createMicrophoneAndCameraTracks(tag, options);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`捕获音视频流失败 -> code: ${code}`);
    return;
  }

  return tracks;
};

/**
 * 自定义资源
 */
const createLocalTrack = async (tag, stream, options) => {
  const { code, tracks } = await rtcClient.createLocalTracks(tag, stream, options);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`捕获音视频流失败 -> code: ${code}`);
    return;
  }

  return tracks;
};

/**
 * 获取麦克风设备
 */
const getMicrophones = async () => {
  return await device.getMicrophones();
};
/**
 * 获取摄像头设备
 */
const getCameras = async () => {
  return await device.getCameras();
};

/**
 * 升级为主播房间
 */
const upgradeToAnchorRoom = async (audienceRoom) => {
  const { room, tracks, userIds, code } = await rtcClient.upgradeToAnchorRoom(audienceRoom);
  // 若升级失败， anchorRoom 为 undefined
  if (code !== RCRTCCode.SUCCESS) {
    console.log('upgrade failed:', code);
  }
  return {
    room,
    tracks,
    userIds
  }
};

/**
 * 升级为主播房间
 */
const downgradeToAudienceRoom = async (anchorRoom) => {
  const { room, RTCTracks, MCUTracks, CDNUris, userIds, code } = await rtcClient.downgradeToAudienceRoom(anchorRoom);
  // 若降级失败，会返回 code, room 为 undefined
  if (code !== RCRTCCode.SUCCESS) {
    console.log('downgrade failed:', code);
  }

  return {
    room,
    RTCTracks,
    MCUTracks,
    CDNUris,
    userIds
  };
};

export default {
  initRTCClient,
  joinRTCRoom,
  leaveRTCRoom,
  joinLivingRoom,
  leaveLivingRoom,
  joinLivingRoomAsAudience,
  leaveLivingRoomAsAudience,
  createMicrophoneAudioTrack,
  createCameraVideoTrack,
  createMicrophoneAndCameraTracks,
  createLocalTrack,
  getMicrophones,
  getCameras,
  upgradeToAnchorRoom,
  downgradeToAudienceRoom
};
