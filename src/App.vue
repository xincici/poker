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
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
body {
  --border-color: #eee;
  --text-color: #2c3e50;
  --bg-color: #fff;
  --mask-color: rgba(255, 255, 255, 0.8);
  &.dark {
    --border-color: #444;
    --text-color: #eee;
    --bg-color: #333;
    --mask-color: rgba(20, 20, 20, 0.8);
  }
}
</style>
