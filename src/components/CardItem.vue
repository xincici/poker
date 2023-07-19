<template>
  <span class="card" :class="`card-${color}`">
    <span class="card-num" v-if="notBack">{{ num }}</span>
    <span class="card-type">
      <i i-mdi-cards-heart v-if="type === 'heart'" />
      <i i-mdi-cards-diamond v-if="type === 'diamond'" />
      <i i-mdi-cards-spade v-if="type === 'spade'" />
      <i i-mdi-cards-club v-if="type === 'club'" />
      <i i-mdi-cards-playing v-if="!notBack" class="card-type-back" />
    </span>
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['num', 'type']);

const color = computed(() => {
  return ['heart', 'diamond'].includes(props.type) ? 'red' : 'black';
});
const notBack = computed(() => {
  return Boolean(props.num && props.type);
});

</script>

<style scoped lang="scss">
.card {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 120px;
  border: 1px solid #aaa;
  border-radius: 5px;
  margin: 5px;
  background: #fff;
  &-red {
    color: #e00;
  }
  &-black {
    color: #111;
  }
  &-num {
    position: absolute;
    top: 6px;
    left: 6px;
    font-size: 18px;
    font-weight: bold;
  }
  &-type {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 36px;
    font-weight: bold;
    transform: translate(-50%, -50%);
    &-back {
      font-size: 60px;
    }
  }
}
</style>
