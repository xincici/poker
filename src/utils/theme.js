import { ref, computed, watchEffect } from 'vue';
import { THEME_KEY } from './constants.js';

export const isDark = ref(Boolean(localStorage.getItem(THEME_KEY)));

const color = computed(() => isDark.value ? '#333' : '#fff');

export const toggle = () => {
  isDark.value = !isDark.value;
};

watchEffect(() => {
  if (isDark.value) localStorage.setItem(THEME_KEY, 1);
  else localStorage.removeItem(THEME_KEY);
  document.body.classList[isDark.value ? 'add' : 'remove']('dark');
  document.querySelector('meta[name="theme-color"]').setAttribute('content', color.value);
});

