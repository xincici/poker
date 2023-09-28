<template>
  <span
    class="card"
    :class="{
      'card-red': isRed && !b2a,
      'card-mini': mini,
      'card-hold': hold,
      animating: a2b || b2a,
    }"
  >
    <span class="card-num card-num-top" v-if="!showBack">{{ point }}</span>
    <span class="card-num card-num-bottom" v-if="!showBack">{{ point }}</span>
    <span class="card-back" v-if="showBack"></span>
    <span class="card-type">
      <i i-mdi-cards-playing v-if="showBack" class="card-type-back" />
      <i i-mdi-cards-heart v-else-if="type === 'heart'" />
      <i i-mdi-cards-diamond v-else-if="type === 'diamond'" />
      <i i-mdi-cards-spade v-else-if="type === 'spade'" />
      <i i-mdi-cards-club v-else-if="type === 'club'" />
    </span>
  </span>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 牌点数对应的展示内容
const NUMS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const props = defineProps(['num', 'type', 'hold', 'mini']);

const isBack = computed(() => !props.num || !props.type);

const isRed = computed(() => ['heart', 'diamond'].includes(props.type));

const point = computed(() => props.num ? NUMS[props.num - 1] : '');

const a2b = ref(false); // card to back
const b2a = ref(false); // back to card

const showBack = computed(() => {
  return isBack.value || b2a.value;
});

const duration = 125;

watch(isBack, val => {
  if (props.mini) return;
  if (val) a2b.value = true;
  else b2a.value = true;
  setTimeout(() => {
    a2b.value = b2a.value = false;
  }, duration);
});

</script>

<style scoped lang="scss">
.card {
  --width: 60px;
  --height: 90px;
  --margin: 4px;
  --radius: 4px;
  --pos: 3px;
  --text-size: 16px;
  --icon-size: 36px;
  --back-size: 42px;
  &-mini {
    --width: 40px;
    --height: 60px;
    --margin: 1px;
    --radius: 3px;
    --pos: 1px;
    --text-size: 12px;
    --icon-size: 20px;
    --back-size: 26px;
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
  cursor: pointer;
  overflow: hidden;
  transition: transform .125s ease-out 0s;
  transform: rotateY(0deg);
  &.animating {
    transform: rotateY(90deg);
  }
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
  &-back {
    position: absolute;
    width: 96%;
    height: 96%;
    left: 2%;
    top: 2%;
    box-sizing: border-box;
    border: 1px dotted #eee;
    border-radius: var(--radius);
    background: radial-gradient(circle, #9a9a9a .2px, transparent .5px);
    background-repeat: repeat;
    background-size: 5% 5%;
  }
}
</style>

