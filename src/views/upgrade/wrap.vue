<script setup>
  import { provide, reactive } from 'vue';

  const roomData = reactive({});
  const setRoomData = (room) => {
    roomData.room = room;
  };
  provide('roomData', roomData);
  provide('setRoomData', setRoomData);

  const setTracks = (tracks) => {
    roomData.tracks = tracks;
  };
  provide('setTracks', setTracks);
</script>

<template>
  <router-view></router-view>
</template>