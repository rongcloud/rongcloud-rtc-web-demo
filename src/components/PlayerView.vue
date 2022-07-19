<script setup>
const props = defineProps({
  id: ''
});
</script>

<template>
<div class="video-container">
  <video :id="props.id"></video>
  <div class="tools">
    <slot></slot>
  </div>
</div>
</template>

<style lang="scss" scoped>
.video-container {
  margin: 10px;
  position: relative;
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
    background: rgba(0, 0, 0, 0.5);
  }

  > video {
    width: 100%;
    height: 100%;
    background-color: #ccc;
  }
}
</style>