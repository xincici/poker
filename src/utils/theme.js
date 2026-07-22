import { ref, computed, watchEffect } from 'vue';
import { THEME_KEY, THEME_MODE_KEY } from './constants.js';

// 主题模式：'auto' | 'dark' | 'light'
// 优先读取新的 mode key，兼容旧的 THEME_KEY（旧版只存 dark/无）
function getInitMode() {
  const saved = localStorage.getItem(THEME_MODE_KEY);
  if (saved === 'dark' || saved === 'light' || saved === 'auto') return saved;
  // 兼容旧版：如果旧版存了强制 dark，则维持 dark；否则默认 auto（跟随系统）
  if (localStorage.getItem(THEME_KEY)) return 'dark';
  return 'auto';
}

// 检测系统是否处于暗色模式
const systemDarkMQ = window.matchMedia('(prefers-color-scheme: dark)');
const systemIsDark = ref(systemDarkMQ.matches);

// 监听系统主题变化
systemDarkMQ.addEventListener('change', (e) => {
  systemIsDark.value = e.matches;
});

// 当前主题模式
export const themeMode = ref(getInitMode());

// 当前是否为暗色（综合模式和系统）
export const isDark = computed(() => {
  if (themeMode.value === 'dark') return true;
  if (themeMode.value === 'light') return false;
  return systemIsDark.value; // auto：跟随系统
});

const color = computed(() => isDark.value ? '#333' : '#fff');

// 手动切换：auto → dark → light → auto
export const toggle = () => {
  const next = { auto: 'dark', dark: 'light', light: 'auto' };
  themeMode.value = next[themeMode.value] || 'auto';
};

watchEffect(() => {
  // 持久化新版 mode
  localStorage.setItem(THEME_MODE_KEY, themeMode.value);
  // 清除旧版 THEME_KEY，避免歧义
  localStorage.removeItem(THEME_KEY);

  document.body.classList[isDark.value ? 'add' : 'remove']('dark');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color.value);
});
