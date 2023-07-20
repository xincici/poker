<template>
  <span class="card" :class="`card-${color} ${hold ? 'card-hold' : ''}`">
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
  display: inline-block;
  position: relative;
  width: 60px;
  height: 100px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  margin: 4px;
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
    font-size: 16px;
    font-weight: bold;
    &-top {
      top: 3px;
      left: 3px;
    }
    &-bottom {
      bottom: 3px;
      right: 3px;
      transform: rotate(180deg);
    }
  }
  &-type {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 36px;
    font-weight: bold;
    transform: translate(-50%, -50%);
    &-back {
      font-size: 50px;
    }
  }
}
</style>

