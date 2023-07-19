<template>
  <span cursor-pointer @click.stop="onClick">🍔</span>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['onScoreReset']);

const max = 5;
const clicked = ref(0);

function onClick() {
  clicked.value++;
  if (clicked.value === max) {
    emit('onScoreReset');
  }
}

function onBodyClick() {
  clicked.value = 0;
}

onMounted(() => {
  document.body.addEventListener('click', onBodyClick);
});

onUnmounted(() => {
  document.body.removeEventListener('click', onBodyClick);
});

</script>

