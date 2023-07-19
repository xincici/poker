import { ref, watchEffect } from 'vue';

import { LANG_KEY } from '../utils/constants.js';

const en = {
  gameTitle: 'Poker',
  bestScore: 'Best Score',
  availableClicks: 'Click Count',
  start: 'New Game',
  helpTip: 'Click for help!',
  helpMsg: 'Click the Roll button to deal cards. After the first deal, click on a card to select it. Click the button again to replace the unselected cards and form the final hand. You win when you have four of a kind, flush, full house, straight, three of a kind, two pairs or a pair of 8s or higher. You can choose to continue guessing the size. If you guess correctly, your bonus will be doubled. If you guess wrong, your bonus will be cleared. You can also click the Check button at any time to settle your bonus.',
  help1: 'The betting range is from 1 to 100.',
  help2: 'The bonus multiplier corresponding to each hand can be found in the left column.',
  help3: 'Guess the number of the card. 1-6 is small, 8-K is big, and 7 is a tie.',
  confirmText: 'OK, I See',
  tipWin: 'You Win',
  tipLost: 'You Lose'
};
const cn = {
  gameTitle: '纸牌',
  bestScore: '最佳得分',
  availableClicks: '点击次数',
  start: '新游戏',
  helpTip: '查看帮助',
  helpMsg: '点击 Roll 按钮发牌，第一次发牌后点击牌可以选择保留该牌，再次点击该按钮会替换掉未被保留的牌，形成最终牌型，当有四条，或同花，或葫芦，或顺子，或三条，或两对，或大于一对8的牌型时胜利，可选择继续猜大小，猜对则奖金加倍，猜错则奖金清零，也可以随时点击 Check 按钮结算奖金。',
  help1: '投注范围 1-100',
  help2: '牌型对应的奖金倍数见左侧栏',
  help3: '猜大小牌点 1-6 为小，8-K 为大，7 为平局',
  confirmText: '好的，明白',
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
