<template>
  <MainGame />
</template>

<script setup>
import MainGame from './components/MainGame.vue';
</script>

<style lang="scss">
html, body, #app {
  height: 100vh;
  margin: 0;
  touch-action: manipulation;
  overscroll-behavior-y: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  --border-color: #e3e4e8;
  --card-border-color: #c9ccd4;
  --text-color: #2c3e50;
  --bg-color: #f2f3f5;
  --card-color: #fff;
  --mask-color: rgba(255, 255, 255, 0.8);
  --max-width: 480px;
  &.dark {
    --border-color: #4a4a4a;
    --card-border-color: #4a4a4a;
    --text-color: #eee;
    --bg-color: #262626;
    --card-color: #333;
    --mask-color: rgba(51, 51, 51, 0.8);
  }
}
</style>
