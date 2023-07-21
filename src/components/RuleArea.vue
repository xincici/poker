<template>
  <div class="rule-area">
    <div
      v-for="item in rules"
      :key="item.times"
      :class="{
        rule: true,
        blink: result === item.times
      }"
    >
      <span>{{ item.title }}</span>
      <span>{{ item.times }}{{ i18n('times') }}</span>
    </div>
  </div>
</template>

<script setup>
import { rules } from '../utils/rules.js';

defineProps(['result']);

</script>

<style scoped lang="scss">
@keyframes blink {
  from {
    opacity: 0.1;
  }
  to {
    opacity: 1;
  }
}

.rule-area {
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0;
  border: 1px solid var(--border-color);
  border-top: 0 none;
  .rule {
    flex: 1 0 50%;
    line-height: 1.8;
    display: flex;
    padding: 0;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 10px;
    &.blink {
      animation: 0.75s ease-in-out 0s infinite blink;
    }
    &:nth-child(odd) {
      padding-right: 15px;
    }
    &:nth-child(even) {
      padding-left: 15px;
    }
  }
}
</style>
