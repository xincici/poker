import { ref, watchEffect } from 'vue';

import { LANG_KEY } from '../utils/constants.js';

const en = {
  gameTitle: 'Poker',
  bestScore: 'Best Score',
  availableClicks: 'Click Count',
  start: 'New Game',
  helpTip: 'Click for help!',
  helpMsg: `Click on a number, if there is a space next to it, it will move over. Your goal is to arrange all the numbers in order to win.`,
  help1: 'Difficulty of the game is 3 ~ 6.',
  help2: 'Besides clicking, you can also use the joystick to play, you can toggle it in the upper left corner.',
  confirmText: 'OK, I See',
  newBest: 'New Best Score',
  tipWin: 'You Win',
  tipLost: 'You Lose'
};
const cn = {
  gameTitle: '纸牌',
  bestScore: '最佳得分',
  availableClicks: '点击次数',
  start: '新游戏',
  helpTip: '查看帮助',
  helpMsg: `点击一个数字，如果它旁边有空格，它会移动过去，你的目标是让所有的数字按照顺序排列即可获胜。`,
  help1: '游戏难度 3 ~ 6',
  help2: '除了点击之外，你还可以使用摇杆进行游戏，在左上角开启关闭',
  confirmText: '好的，明白',
  newBest: '新纪录诞生',
  tipWin: '你赢了',
  tipLost: '你输了'
};

const langs = { en, cn };

export const language = ref(localStorage.getItem(LANG_KEY) || 'cn');

export const toggle = () => {
  language.value = language.value === 'en' ? 'cn' : 'en';
};

watchEffect(() => {
  document.title = langs[language.value]['gameTitle'];
  localStorage.setItem(LANG_KEY, language.value);
});

export default {
  install: app => {
    app.config.globalProperties.i18n = fullKey => {
      return fullKey.split('.').reduce((obj, key) => {
        if (obj) return obj[key];
      }, langs[language.value]);
    };
  }
}
