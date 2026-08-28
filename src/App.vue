<template>
  <MainGame />
  <div class="landscape-tip">
    <span>📱</span>
    <span>{{ i18n('rotateTip') }}</span>
  </div>
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
.landscape-tip {
  display: none;
}
@media only screen and (orientation: landscape) and (max-height: 500px) {
  .landscape-tip {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    height: 100dvh;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    font-size: 18px;
    font-weight: bold;
    color: var(--text-color);
    background: var(--bg-color);
    span:first-child {
      font-size: 40px;
    }
  }
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
