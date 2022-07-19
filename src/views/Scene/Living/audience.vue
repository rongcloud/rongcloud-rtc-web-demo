<script setup>
import { reactive, ref } from 'vue';
import { userId } from '../../../services/im';
import rtc from '../../../services/rtc';
import {
  RCRTCCode
} from '@rongcloud/plugin-rtc';
import PlayerView from '../../../components/PlayerView.vue';
import { includes } from 'lodash';

let cameraList = reactive([]);
let microphoneList = reactive([]);
let form = reactive({
  userId: userId,
  roomId: String(Math.floor(Math.random() * 89999) + 10000),
  cameraId: '',
  microphoneId: ''
});
(async () => {
  const cameras = await rtc.getCameras();
  cameraList.push(...cameras);
  const microphones = await rtc.getMicrophones();
  microphoneList.push(...microphones);
  form.cameraId = cameraList[0].deviceId;
  form.microphoneId = microphoneList[0].deviceId;
})();
const name = '音视频直播-观众';
let onRoom = ref(false);
let room = null;
let userIds = reactive([]);
let remoteTracks = reactive([]);
let MCUTracks = reactive([]);
let volume = reactive({});
const handler = (audioLevelReportList) => {
  audioLevelReportList.forEach(item => {
    volume[item.track.getUserId()] = item.audioLevel || 0;
  });
}
/**
 * 加入房间
 */
const joinRoom = async () => {
  const res = await rtc.joinLivingRoomAsAudience(form.roomId);
  room = res.room;
  userIds.length = 0;
  userIds.push(...(res.userIds || []));
  remoteTracks.length = 0;
  remoteTracks.push(...(res.RTCTracks || []));
  MCUTracks.length = 0;
  MCUTracks.push(...(res.MCUTracks || []));
  if (MCUTracks.length > 0) {
    subscribe(room, MCUTracks);
  }
  onRoom.value = true;
  room.onAudioLevelChange(handler, 300);
  initAudienceRoomListener(room);
}
/**
 * 离开房间
 */
const leaveRoom = async () => {
  await rtc.leaveLivingRoomAsAudience(room);
  onRoom.value = false;
  userIds.length = 0;
  remoteTracks.length = 0;
};

const initAudienceRoomListener = (room) => {
  registerPeerReportListener(room);
  room.registerRoomEventListener({
    onAnchorJoin (userId) {
      let newUserIds = new Set([userId, ...userIds]);

      userIds.length = 0;
      userIds.push(...newUserIds);
    },
    onAnchorLeave (userId) {
      let newUserIds = new Set([...userIds]);

      if (newUserIds.has(userId)) {
        newUserIds.delete(userId);
      }

      userIds.length = 0;
      userIds.push(...newUserIds);
    },
    onAudioMuteChange (audioTrack) {
      isRemoteOwnerMuted[audioTrack.getTrackId()] = audioTrack.isOwnerMuted();
    },
    onVideoMuteChange (videoTrack) {
      isRemoteOwnerMuted[videoTrack.getTrackId()] = videoTrack.isOwnerMuted();
    },
    onTrackPublish (tracks) {
      console.log(tracks, 'onTrackPublish')
      tracks.forEach(itemInTracks => {
        if (!remoteTracks.some(item => item.getTrackId() === itemInTracks.getTrackId())) {
          remoteTracks.push(itemInTracks);
        }
      });
      subscribe(room, tracks);
    },
    onTrackUnpublish (tracks) {
      tracks.forEach(itemInTracks => {
        const index = remoteTracks.findIndex(item => item.getTrackId() === itemInTracks.getTrackId())
        if (index !== -1) {
          remoteTracks.splice(index, 1);
        }
      });
      unsubscribe(room, tracks);
    },
    onAnchorTrackPublish (tracks) {
      console.log(tracks, 'onAnchorTrackPublish')
      tracks.forEach(itemInTracks => {
        if (!remoteTracks.some(item => item.getTrackId() === itemInTracks.getTrackId())) {
          remoteTracks.push(itemInTracks);
        }
      });
    },
    onAnchorTrackUnpublish (tracks) {
      console.log(tracks, 'onAnchorTrackUnpublish')
      tracks.forEach(itemInTracks => {
        const index = remoteTracks.findIndex(item => item.getTrackId() === itemInTracks.getTrackId())
        if (index !== -1) {
          remoteTracks.splice(index, 1);
        }
      });
    },
    onTrackReady (track) {
      const userId = track.getUserId();
      const tag = track.getTag();
      const trackId = track.getTrackId();
      if (tag.includes('user')) {
        playTrack(track, document.getElementById('user_' + userId));
      } else if (tag.includes('screen')) {
        playTrack(track, document.getElementById('screen_' + trackId));
      } else if (tag.includes('MCU')) {
        setTimeout(() => {
          playTrack(track, document.getElementById('targetTrack'));
        });
      }
    }
  });
};

const registerPeerReportListener = (room) => {
  room.registerReportListener({
    onICEConnectionStateChange (state, pcName) {
      console.log('onICEConnectionStateChange:', state, pcName);
    },
    onConnectionStateChange (state, pcName) {
      console.log('onConnectionStateChange:', state, pcName);
    },
    onStateReport (reports) {
      // console.log('reports:', reports)
      const peerConnectionReport = {
        iceCandidatePair: [],
        upDownData: [],
      };

      if (reports.iceCandidatePair) {
        /**
         * 上下行可用带宽，大于 1000 时，转为 kbps 单位，小于 1000 时，使用 bit 单位
         */
        let availableOutgoingBitrate = reports.iceCandidatePair.availableOutgoingBitrate;
        let availableIncomingBitrate = reports.iceCandidatePair.availableIncomingBitrate;

        if (availableOutgoingBitrate) {
          if (availableOutgoingBitrate > 1000) {
            availableOutgoingBitrate = `${parseInt(String(availableOutgoingBitrate / 1000))} kbps`;
          } else {
            availableOutgoingBitrate = `${availableOutgoingBitrate} bit`;
          }
        }

        if (availableIncomingBitrate) {
          if (availableIncomingBitrate > 1000) {
            availableIncomingBitrate = `${parseInt(String(availableIncomingBitrate / 1000))} kbps`;
          } else {
            availableIncomingBitrate = `${availableIncomingBitrate} bit`;
          }
        }
        const data = {
          localAddress: `${reports.iceCandidatePair.IP || 'unknown'}:${reports.iceCandidatePair.port}`,
          remoteAddress: `${reports.iceCandidatePair.remoteIP}:${reports.iceCandidatePair.remotePort}`,
          bitrateSend: `${reports.iceCandidatePair.bitrateSend} kbps`,
          bitrateRecv: `${reports.iceCandidatePair.bitrateRecv} kbps`,
          rtt: reports.iceCandidatePair.rtt && `${reports.iceCandidatePair.rtt} ms`,
          availableOutgoingBitrate: availableOutgoingBitrate || '0 bit',
          availableIncomingBitrate: availableIncomingBitrate || '0 bit',
        };
        peerConnectionReport.iceCandidatePair = [Object.assign(reports.iceCandidatePair, data)];
      }

      peerConnectionReport.upDownData = [reports.senders, reports.receivers];

      monitorData[0] = peerConnectionReport;
    },
  });
};

/**
 * 订阅资源
 */
const subscribe = async (room, tracks) => {
  const { code } = await room.subscribe(tracks);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`资源订阅失败 -> code: ${code}`);
    return;
  }
  console.log(remoteTracks, '=======');

  tracks.forEach(itemInTracks => {
    if (!remoteTracks.some(item => item.getTrackId() === itemInTracks.getTrackId())) {
      remoteTracks.push(itemInTracks);
    }
  });
};
/**
 * 取消订阅资源
 */
const unsubscribe = async (room, tracks) => {
  const { code } = await room.unsubscribe(tracks);

  if (code !== RCRTCCode.SUCCESS) {
    console.log(`取消资源订阅失败 -> code: ${code}`);
    return;
  }

  tracks.forEach(itemInTracks => {
    const index = remoteTracks.findIndex(item => item.getTrackId() === itemInTracks.getTrackId())
    if (index !== -1) {
      remoteTracks.splice(index, 1);
    }
  });
  console.log(remoteTracks, '=======');
};

/**
 * 禁用资源
 */
const mute = (track) => {
  track.mute();
};
/**
 * 启用资源
 */
const unmute = (track) => {
  track.unmute();
};

/**
 * 播放资源
 */
const playTrack = (track, target) => {
  if (track.isAudioTrack()) {
    track.play();
  } else {
    track.play(target);
  }
};

let isRemoteVideoLocalMuted = reactive({});
/**
 * 本地禁用/启用远端视频轨道
 */
const toggleReomteVideoLocalMuteStatus = () => {
  const track = getVideoTrack();
  const status = getTrackLocalMuteStatus(track);
  if (status) {
    unmute(track);
  } else {
    mute(track);
  }
  isRemoteVideoLocalMuted['mcu'] = !status;
};
let isRemoteAudioLocalMuted = reactive({});
/**
 * 本地禁用/启用远端音频轨道
 */
const toggleReomteAudioLocalMuteStatus = () => {
  const track = getAudioTrack();
  const status = getTrackLocalMuteStatus(track);
  if (status) {
    unmute(track);
  } else {
    mute(track);
  }
  isRemoteAudioLocalMuted['mcu'] = !status;
};
/**
 * 获取指定视频轨道
 */
const getVideoTrack = () => {
  return MCUTracks.filter(track => track.isVideoTrack())?.[0];
};
/**
 * 获取指定音频轨道
 */
const getAudioTrack = () => {
  return MCUTracks.filter(track => track.isAudioTrack())?.[0];
};
/**
 * 获取轨道状态
 */
const getTrackLocalMuteStatus = (track) => {
  return track?.isLocalMuted();
};

let isRemoteOwnerMuted = reactive({});

let monitorData = reactive([{}]);

let isAudience = ref(true);
const upgradeToAnchorRoom = async () => {
  const res = await rtc.upgradeToAnchorRoom(room);
  isAudience.value = false;
  room = res.room;
  userIds.length = 0;
  userIds.push(...(res.userIds || []));
  remoteTracks.length = 0;
  remoteTracks.push(...(res.tracks || []));
  if (remoteTracks.length > 0) {
    subscribe(room, remoteTracks);
  }
  onRoom.value = true;
  room.onAudioLevelChange(handler, 300);
  initAudienceRoomListener(room);
  await createMicrophoneAudioTrack();
  await createCameraVideoTrack();
  publishAll();
};

const downgradeToAudienceRoom = async () => {
  const res = await rtc.downgradeToAudienceRoom(room);
  isAudience.value = true;
  room = res.room;
  userIds.length = 0;
  userIds.push(...(res.userIds || []));
  remoteTracks.length = 0;
  remoteTracks.push(...(res.RTCTracks || []));
  MCUTracks.length = 0;
  MCUTracks.push(...(res.MCUTracks || []));
  if (MCUTracks.length > 0) {
    subscribe(room, MCUTracks);
  }
  onRoom.value = true;
  room.onAudioLevelChange(handler, 300);
  initAudienceRoomListener(room);
};

let audioTrack = null;
let isAudioMuted = ref(false);
const createMicrophoneAudioTrack = async () => {
  audioTrack = await rtc.createMicrophoneAudioTrack('user');
  playTrack(audioTrack);
  isAudioMuted.value = false;
};
const toggleAudioMuteStatus = () => {
  if (isAudioMuted.value) {
    unmute(audioTrack);
  } else {
    mute(audioTrack);
  }
  isAudioMuted.value = !isAudioMuted.value;
};

let videoTrack = null;
let isVideoMuted = ref(false);
const createCameraVideoTrack = async () => {
  videoTrack = await rtc.createCameraVideoTrack('user');
  playTrack(videoTrack, document.getElementById('user_' + userId.value));
  isVideoMuted.value = false;
};
const toggleVideoMuteStatus = () => {
  if (isVideoMuted.value) {
    unmute(videoTrack);
  } else {
    mute(videoTrack);
  }
  isVideoMuted.value = !isVideoMuted.value;
};

let isPublished = ref(false);
/**
 * 资源发布
 */
const publish = async (room, tracks) => {
  const { code } = await room.publish(tracks);

  if (code !== RCRTCCode.SUCCESS) {
    console.log('资源发布失败:', code);
    return;
  }
  isPublished.value = true;
};
/**
 * 取消发布资源
 */
const unpublish = async (room, tracks) => {
  const { code } = await room.unpublish(tracks);

  if (code !== RCRTCCode.SUCCESS) {
    console.log('取消发布失败:', code);
    return;
  }
  isPublished.value = false;
};

const publishAll = async () => {
  await publish(room, [audioTrack, videoTrack]);
};
const unpublishAll = async () => {
  await unpublish(room, [audioTrack, videoTrack]);
};
</script>

<template>
  <el-divider content-position="center" border-style="dotted">{{ name }}</el-divider>
  <div class="monitor">
    <el-table :data="monitorData[0].iceCandidatePair" style="width: 100%" border>
      <el-table-column prop="localAddress" label="本端地址"></el-table-column>
      <el-table-column prop="networkType" label="本地网络类型"></el-table-column>
      <el-table-column prop="remoteAddress" label="远端地址"></el-table-column>
      <el-table-column prop="protocol" label="协议"></el-table-column>
      <el-table-column prop="bitrateSend" label="发送总码率"></el-table-column>
      <el-table-column prop="bitrateRecv" label="接收总码率"></el-table-column>
      <el-table-column prop="rtt" label="往返时延"></el-table-column>
      <el-table-column prop="availableOutgoingBitrate" label="可用上行带宽"></el-table-column>
      <el-table-column prop="availableIncomingBitrate" label="可用下行带宽"></el-table-column>
    </el-table>
  </div>
  <div class="meeting">
    <div class="left">
      <el-form
        label-position="right"
        label-width="100px"
        :model="form"
      >
        <el-form-item label="UserID">
          <el-input v-model="form.userId" disabled />
        </el-form-item>
        <el-form-item label="RoomID">
          <el-input v-model="form.roomId" />
        </el-form-item>
        <el-form-item label="Camera">
          <el-select v-model="form.cameraId">
            <el-option
              v-for="camera in cameraList"
              :label="camera.label"
              :value="camera.deviceId"
              :key="camera.deviceId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Microphone">
          <el-select v-model="form.microphoneId">
            <el-option
              v-for="microphone in microphoneList"
              :label="microphone.label"
              :value="microphone.deviceId"
              :key="microphone.deviceId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="handler">
        <div>
          <el-button type="primary" :disabled="onRoom" @click="joinRoom">加入房间</el-button>
          <el-button type="primary" :disabled="!onRoom" @click="leaveRoom">离开房间</el-button>
        </div>
        <div>
          <el-button type="primary" :disabled="!isAudience" @click="upgradeToAnchorRoom">升为主播</el-button>
          <el-button type="primary" :disabled="isAudience" @click="downgradeToAudienceRoom">降为观众</el-button>
        </div>
      </div>
    </div>
    <div class="center" id="resources-content">
      <PlayerView
        v-if="isAudience"
        id="targetTrack"
      >
        <template v-slot:default>
          <div class="custom-tools">
            <span class="user">订阅合流</span>
            <div :class="['icon', isRemoteVideoLocalMuted['mcu'] ? 'icon-disabled' : '']" @click="toggleReomteVideoLocalMuteStatus">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M704 768V256H128v512h576zm64-416 192-96v512l-192-96v128a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32v128zm0 71.552v176.896l128 64V359.552l-128 64zM192 320h192v64H192v-64z"></path></svg>
            </div>
            <div :class="['icon', isRemoteAudioLocalMuted['mcu'] ? 'icon-disabled' : '']" @click="toggleReomteAudioLocalMuteStatus">
              <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"></path></svg>
              <div class="volume" :style="{'height': volume['mcu'] + '%'}">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"></path></svg>
              </div>
            </div>
          </div>
        </template>
      </PlayerView>
      <template v-else>
        <PlayerView
          :id="'user_' + userId"
        >
          <template v-slot:default>
            <div class="custom-tools">
              <span class="user">{{ userId }}</span>
              <div :class="['icon', isVideoMuted ? 'icon-disabled' : '']" @click="toggleVideoMuteStatus">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M704 768V256H128v512h576zm64-416 192-96v512l-192-96v128a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32v128zm0 71.552v176.896l128 64V359.552l-128 64zM192 320h192v64H192v-64z"></path></svg>
              </div>
              <div :class="['icon', isAudioMuted ? 'icon-disabled' : '']" @click="toggleAudioMuteStatus">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"></path></svg>
                <div class="volume" :style="{'height': volume[userId] + '%'}">
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"></path></svg>
                </div>
              </div>
            </div>
          </template>
        </PlayerView>
        <template v-for="userId in userIds.filter(item => item !== userId)">
          <PlayerView
            :id="'user_' + userId"
          >
            <template v-slot:default>
              <div class="custom-tools">
                <span class="user">{{ userId }}</span>
                <div :class="['icon', isRemoteVideoLocalMuted[userId] ? 'icon-disabled' : '']" @click="toggleReomteVideoLocalMuteStatus(userId)">
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M704 768V256H128v512h576zm64-416 192-96v512l-192-96v128a32 32 0 0 1-32 32H96a32 32 0 0 1-32-32V224a32 32 0 0 1 32-32h640a32 32 0 0 1 32 32v128zm0 71.552v176.896l128 64V359.552l-128 64zM192 320h192v64H192v-64z"></path></svg>
                </div>
                <div :class="['icon', isRemoteAudioLocalMuted[userId] ? 'icon-disabled' : '']" @click="toggleReomteAudioLocalMuteStatus(userId)">
                  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"></path></svg>
                  <div class="volume" :style="{'height': volume[userId] + '%'}">
                    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="M512 128a128 128 0 0 0-128 128v256a128 128 0 1 0 256 0V256a128 128 0 0 0-128-128zm0-64a192 192 0 0 1 192 192v256a192 192 0 1 1-384 0V256A192 192 0 0 1 512 64zm-32 832v-64a288 288 0 0 1-288-288v-32a32 32 0 0 1 64 0v32a224 224 0 0 0 224 224h64a224 224 0 0 0 224-224v-32a32 32 0 1 1 64 0v32a288 288 0 0 1-288 288v64h64a32 32 0 1 1 0 64H416a32 32 0 1 1 0-64h64z"></path></svg>
                  </div>
                </div>
              </div>
            </template>
          </PlayerView>
        </template>
      </template>
    </div>
    <div class="right">
      <ul class="track-list">
        <li>
          <span class="type">类型</span>
          <span class="id">轨道ID</span>
          <span class="status">远端禁用状态</span>
        </li>
        <template v-for="track in remoteTracks">
          <li>
            <span class="type">{{track.isAudioTrack() ? '音频' : track.isVideoTrack() ? '视频' : '自定义'}}</span>
            <span class="id">{{track.getTrackId()}}</span>
            <span class="status">{{isRemoteOwnerMuted[track.getTrackId()] ?? track.isOwnerMuted() ? '禁用' : '启用'}}</span>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.meeting {
  margin-top: 20px;
  display: flex;
  .left {
    width: 300px;
    .handler {
      > div {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-items: center;

        .el-button {
          margin:  5px;
        }
      }
    }
  }
  .center {
    display: flex;
    margin-left: 20px;
    flex-grow: 1;
    flex-wrap: wrap;
    background-color: #fcfcfc;

    .custom-tools {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .user {
        padding: 0 10px;
        width: 65%;
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .icon {
        position: relative;
        margin: 0 5px;
        width: 25px;
        height: 25px;
        color: #fff;
        cursor: pointer;

        svg {
          bottom: 0;
          left: 0;
          position: absolute;
        }

        .volume {
          position: absolute;
          width: 100%;
          bottom: 0;
          color: #abd4fd;
          overflow: hidden;
          transition: height 0.5s ease-out;
        }
      }

      .icon-disabled {
        color: #666;

        .volume {
          display: none;
        }
      }
    }
  }

  .right {
    width: 500px;

    .track-list {
      list-style: none;

      li {
        &:nth-child(2n) {
          background-color: #abd4fd;
          color: #fff;
        }
      }

      span {
        display: inline-block;
        text-align: center;
      }

      .type {
        width: 50px;
      }

      .id {
        width: 200px;
      }

      .status {
        width: 100px;
      }
    }
  }
}
</style>