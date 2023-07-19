<template>
  <div class="wrapper" :class="`${theme}`">
    <TopHeader />
    <div class="score-area">
    </div>
    <div class="game-area">
      <CardItem num="5" type="heart" />
      <CardItem />
      <CardItem num="A" type="diamond" />
      <CardItem num="J" type="spade" />
      <CardItem num="Q" type="club" />
      <CardItem />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue';

import TopHeader from './TopHeader.vue';
import CardItem from './CardItem.vue';
import { theme } from '../utils/theme';
import confetti from '../utils/confetti';

</script>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  min-width: 360px;
  min-height: 100vh;
  box-sizing: border-box;
  color: #2c3e50;
  overflow-y: auto;
  &.dark {
    background: #444;
    color: #eee;
    .header-wrapper {
      border-bottom: 1px solid #333;
    }
    .game-area {
    }
  }
  .header-wrapper {
    border-bottom: 1px solid #eee;
  }
  .score-area {
    margin: 50px 0 15px;
  }
  .game-area {
  }
  .rocker-area {
  }
}
@media only screen and (min-width: 320px) and (max-width: 720px) {
  * {
    user-select: none;
  }
}
</style>
