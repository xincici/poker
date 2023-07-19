import { createApp } from 'vue';

import i18n from './plugins/i18n';

import App from './App.vue';

import 'virtual:uno.css';

createApp(App)
  .use(i18n)
  .mount('#app');
