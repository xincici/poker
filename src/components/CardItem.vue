<template>
  <span
    class="card"
    :class="`card-${color} ${hold ? 'card-hold' : ''} ${mini ? 'card-mini' : ''}`"
  >
    <span class="card-num card-num-top" v-if="num">{{ num }}</span>
    <span class="card-num card-num-bottom" v-if="num">{{ num }}</span>
    <span class="card-type">
      <i i-mdi-cards-heart v-if="type === 'heart'" />
      <i i-mdi-cards-diamond v-else-if="type === 'diamond'" />
      <i i-mdi-cards-spade v-else-if="type === 'spade'" />
      <i i-mdi-cards-club v-else-if="type === 'club'" />
      <i i-mdi-cards-playing v-else class="card-type-back" />
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['num', 'type', 'hold', 'mini']);

const color = computed(() => {
  return ['heart', 'diamond'].includes(props.type) ? 'red' : 'black';
});

</script>

<style scoped lang="scss">
.card {
  --width: 60px;
  --height: 100px;
  --margin: 4px;
  --radius: 5px;
  --pos: 3px;
  --text-size: 16px;
  --icon-size: 36px;
  --back-size: 50px;
  &-mini {
    --width: 30px;
    --height: 50px;
    --margin: 3px;
    --radius: 2px;
    --pos: 1px;
    --text-size: 12px;
    --icon-size: 20px;
    --back-size: 30px;
  }
}
.card {
  display: inline-block;
  position: relative;
  width: var(--width);
  height: var(--height);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  margin: var(--margin);
  background: #fafafa;
  color: #111;
  &-red {
    color: #e00;
  }
  &-hold {
    outline: 3px solid #e00;
  }
  &-num {
    position: absolute;
    font-size: var(--text-size);
    font-weight: bold;
    &-top {
      top: var(--pos);
      left: var(--pos);
    }
    &-bottom {
      bottom: var(--pos);
      right: var(--pos);
      transform: rotate(180deg);
    }
  }
  &-type {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: var(--icon-size);
    font-weight: bold;
    transform: translate(-50%, -50%);
    &-back {
      font-size: var(--back-size);
    }
  }
}
</style>

