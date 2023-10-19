<template>
  <div class="header-wrapper">
    <span class="item-wrapper">
      <HelpDialog />
    </span>
    <span class="item-wrapper" @click="toggleDice">
      <i i-mdi-dice-5 v-if="dice" />
      <i i-mdi-dice-5-outline v-else />
    </span>
    <span class="title">{{ i18n('gameTitle') }}</span>
    <span class="item-wrapper" @click="toggleTheme">
      <i i-carbon-moon v-if="isDark" />
      <i i-carbon-sun v-else />
    </span>
    <span class="item-wrapper" @click="toggleLanguage">
      <i i-carbon-ibm-watson-language-translator />
    </span>
  </div>
</template>

<script setup>
import HelpDialog from './HelpDialog.vue';
import { toggle as toggleLanguage } from '../plugins/i18n.js';
import { isDark, toggle as toggleTheme } from '../utils/theme.js';
import { dice, toggle as toggleDice } from '../utils/dice.js';

</script>

<style scoped lang="scss">
.header-wrapper {
  background: var(--bg-color);
  max-width: var(--max-width);
  padding: 10px 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 50px;
  border: 1px solid var(--border-color);
  border-top: 0 none;
  z-index: 1;
  .title {
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }
  .item-wrapper {
    flex-grow: 0;
    cursor: pointer;
    margin: 0 8px;
    font-size: 20px;
  }
}
</style>
