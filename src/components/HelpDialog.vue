<template>
  <span class="help" :title="i18n('helpTip')" @click="helpShow = true">
    <i pointer i-carbon-help text-inherit />
  </span>
  <Teleport to="body">
    <div class="help-wrapper" v-show="helpShow">
      <Transition name="inner">
        <div class="help-inner" v-if="helpShow">
          <div class="help-content">
            <p class="help-icon">
              <i pointer i-carbon-help text-inherit />
            </p>
            <p class="help-text">{{ i18n('helpMsg') }}</p>
            <ul class="help-list">
              <li>1. {{ i18n('help1') }}</li>
              <li>2. {{ i18n('help2') }}</li>
              <li>3. {{ i18n('help3') }}</li>
            </ul>
          </div>
          <div class="help-button">
            <button @click="helpShow = false">{{ i18n('confirmText') }}</button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

import { HELPED_KEY } from '../utils/constants.js';

const helpShow = ref(Boolean(!localStorage.getItem(HELPED_KEY)));

const metaThemeColorEl = document.querySelector('meta[name="theme-color"]');
let lastColor = metaThemeColorEl.getAttribute('content');

watch(helpShow, val => {
  if (val) {
    localStorage.setItem(HELPED_KEY, 1);
    lastColor = metaThemeColorEl.getAttribute('content');
    metaThemeColorEl.setAttribute('content', 'rgba(0,0,0,0.85)');
  } else {
    metaThemeColorEl.setAttribute('content', lastColor);
  }
}, { immediate: true });

</script>

<style scoped lang="scss">
.help {
  font-size: 20px;
}
.inner-enter-from {
  transform: scale(0.1);
}
.inner-enter-active {
  transition: transform 0.16s ease-in-out;
}
.inner-enter-to {
  transform: scale(1);
}
.help-wrapper {
  position: fixed;
  z-index: 10;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: rgba(0, 0, 0, .85);
  display: flex;
  align-items: center;
  justify-content: center;
  .help-inner {
    text-align: left;
    width: 720px;
    margin: 0;
    .help-icon {
      text-align: center;
      font-size: 28px;
      color: #fff;
    }
    .help-text {
      color: #eee;
    }
    .help-list {
      list-style: none;
      padding: 10px;
      color: #fff;
    }
    .help-button {
      text-align: right;
      button {
        cursor: pointer;
        padding: 10px 20px;
        color: #fff;
        background: rgba(60, 160, 60, 0.9);
        border: 0 none;
        border-radius: 6px;
        font-weight: bold;
      }
    }
  }
}
@media only screen and (min-width: 320px) and (max-width: 720px) {
  .help-wrapper .help-inner {
    max-width: 90%;
  }
}
</style>
