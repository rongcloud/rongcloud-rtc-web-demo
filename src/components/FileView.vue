<script setup>
const props = defineProps({
  id: ''
});

const full = () => {
  document.getElementById(props.id).requestFullscreen();
}
</script>

<template>
<div class="video-container">
  <video :id="props.id"></video>
  <div class="tools">
    <span>{{ props.id }}</span>
    <div @click="full">
      <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-78e17ca8=""><path fill="currentColor" d="m160 96.064 192 .192a32 32 0 0 1 0 64l-192-.192V352a32 32 0 0 1-64 0V96h64v.064zm0 831.872V928H96V672a32 32 0 1 1 64 0v191.936l192-.192a32 32 0 1 1 0 64l-192 .192zM864 96.064V96h64v256a32 32 0 1 1-64 0V160.064l-192 .192a32 32 0 1 1 0-64l192-.192zm0 831.872-192-.192a32 32 0 0 1 0-64l192 .192V672a32 32 0 1 1 64 0v256h-64v-.064z"></path></svg>
    </div>
  </div>
</div>
</template>

<style lang="scss" scoped>
.video-container {
  position: relative;
  margin: 10px;
  width: 320px;
  height: 240px;
  box-sizing: border-box;
  overflow: hidden;

  .tools {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.5);

    > span {
      color: #fff;
    }

    > div {
      width: 25px;
      height: 25px;
      color: #fff;
    }
  }

  > video {
    width: 100%;
  }
}
</style>