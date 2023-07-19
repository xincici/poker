import { ref, computed, watchEffect } from 'vue';
import { THEME_KEY } from './constants.js';

const DARK = 'dark';
const LIGHT = 'light';

const themeColor = {
  [DARK]: '#444',
  [LIGHT]: '#fff'
};

export const theme = ref(localStorage.getItem(THEME_KEY) || LIGHT);

export const isDark = computed(() => {
  return theme.value === DARK;
});
export const toggle = () => {
  theme.value = theme.value === DARK ? LIGHT : DARK;
};

watchEffect(() => {
  localStorage.setItem(THEME_KEY, theme.value);
  document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor[theme.value]);
});