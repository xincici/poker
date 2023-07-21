<template>
  <div class="wrapper">
    <TopHeader />
    <div class="game-area">
      <div class="money-area">
        <div>
          <span class="title">{{ i18n('total') }}</span>
          <span class="money" :class="{zoom: game.zoomTotal}">{{ game.total }}</span>
        </div>
        <div>
          <span class="title">{{ i18n('win') }}</span>
          <span class="money" :class="{zoom: game.zoomWin}">{{ game.win }}</span>
        </div>
        <div>
          <span class="title">{{ i18n('bet') }}</span>
          <span>{{ game.bet }}</span>
        </div>
      </div>
      <RuleArea :result="game.result" />
      <div class="card-area">
        <CardItem
          v-for="(card, idx) in game.cards"
          :key="idx"
          :num="NUMS[card[0] - 1] || ''"
          :type="card[1]"
          :hold="game.holds[idx]"
          @click="onCardClick(idx)"
        />
        <div class="result-win" v-if="game.stage === GUESS">
          🎉🎉 {{ i18n('tipWin') }} 🎉🎉
        </div>
        <div class="result-lose" v-if="game.stage === LOSE">
          👻👻 {{ i18n('tipLost') }} 👻👻
        </div>
      </div>
      <div class="opt-area">
        <button class="btn" :disabled="game.stage !== GUESS" @click="guessBigOrSmall(true)">{{ i18n('big') }}</button>
        <span class="card-wrapper">
          <CardItem :mini="true" :num="NUMS[randomCard[0] - 1] || ''" :type="randomCard[1]" />
        </span>
        <button class="btn" :disabled="game.stage !== GUESS" @click="guessBigOrSmall(false)">{{ i18n('small') }}</button>
        <button
          class="btn"
          :disabled="game.animating || game.stage > SECOND"
          @click="onPlayClick"
        >
          {{ game.stage === WAIT ? i18n('roll') : i18n('change') }}
        </button>
        <button
          class="btn"
          :disabled="game.animating || game.stage < GUESS"
          @click="onResetClick"
        >
          {{ game.stage === GUESS ? i18n('settle') : i18n('reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue';
import sampleSize from 'lodash.samplesize';

import TopHeader from './TopHeader.vue';
import RuleArea from './RuleArea.vue';
import CardItem from './CardItem.vue';
import { rules } from '../utils/rules.js';

import { TOTAL_KEY, BET_KEY } from '../utils/constants.js';
const LEN = 5;

const initTotal = ref(+localStorage.getItem(TOTAL_KEY) || 1000);
const initBet = ref(+localStorage.getItem(BET_KEY) || 10);

const [ WAIT, FIRST, SECOND, GUESS, LOSE ] = [0, 1, 2, 3, 4];
const ALL_CARDS = new Array(13 * 4).fill(1).map((_, i) => i + 1);
const NUMS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const TYPES = ['heart', 'diamond', 'spade', 'club'];

const sleep = ms => new Promise(res => setTimeout(res, ms));

const getInitData = () => ({
  win: 0,
  result: 0,
  randomNum: 0,
  stage: WAIT,
  animating: false,
  cards: Array.from({ length: LEN }, () => (['', ''])),
  holds: new Array(LEN).fill(false),
  zoomTotal: false,
  zoomWin: false,
});

const game = reactive({
  total: initTotal.value,
  bet: initBet.value,
  ...getInitData(),
});

const curCards = computed(() => game.cards.map(cardToNum));
const randomCard = computed(() => numToCard(game.randomNum));

let guessTimer = null;

watch(() => game.win, val => {
  if (val === 0) return;
  game.zoomWin = true;
  setTimeout(() => {
    game.zoomWin = false;
  }, 600);
});
watch(() => game.total, val => {
  game.zoomTotal = true;
  setTimeout(() => {
    game.zoomTotal = false;
  }, 600);
});

watch(() => game.stage, val => {
  if (val !== GUESS) {
    if (guessTimer) clearInterval(guessTimer);
    guessTimer = null;
    return;
  }
  startGuessTimer();
});

watchEffect(() => {
  localStorage.setItem(TOTAL_KEY, game.total);
  localStorage.setItem(BET_KEY, game.bet);
});

function numToCard(val) {
  if (!val) return ['', ''];
  const num = val % 13 || 13;
  const type = TYPES[~~(val / 13.01)];
  return [ num, type ];
}
function cardToNum(card) {
  const [ num, type ] = card;
  if (!num || !type) return -1;
  return TYPES.indexOf(type) * 13 + num;
}

function randomOne(all) {
  if (all) return Math.ceil(Math.random() * 52);
  while (true) {
    const val = Math.ceil(Math.random() * 52);
    if (!curCards.value.includes(val)) return val;
  }
}

function onCardClick(idx) {
  if (game.stage !== FIRST) return;
  game.holds[idx] = !game.holds[idx];
}

async function onPlayClick() {
  if (game.animating) return;
  if (game.stage > SECOND) return;
  game.animating = true;
  if (game.stage === WAIT) {
    if (game.total >= game.bet) {
      game.total -= game.bet;
    } else {
      game.bet = game.total;
      game.total = 0;
    }
    game.cards = Array.from({ length: LEN }, () => (['', '']));
    const cards = sampleSize(ALL_CARDS, LEN);
    for (let i = 0; i < LEN; i++) {
      await sleep(250);
      game.cards[i] = numToCard(cards[i]);
    }
  } else if (game.stage === FIRST) {
    game.holds.forEach((val, idx) => {
      if (!val) game.cards[idx] = ['', ''];
    });
    for (let i = 0; i < LEN; i++) {
      if (game.holds[i]) continue;
      await sleep(250);
      game.cards[i] = numToCard(randomOne());
    }
  }
  game.animating = false;
  game.stage++;
  if (game.stage === SECOND) {
    const res = judgeResult();
    console.log({ res });
    if (!res) {
      game.stage = LOSE;
      return;
    }
    game.stage = GUESS;
    game.result = res.times;
    game.win = game.bet * res.times;
  }
}

function onResetClick() {
  if (game.stage === GUESS) {
    game.total += game.win;
  }
  Object.assign(game, getInitData());
}

function startGuessTimer() {
  guessTimer = setInterval(() => {
    game.randomNum = Math.ceil(Math.random() * 52);
  }, 125);
}

function guessBigOrSmall(isBig) {
  clearInterval(guessTimer);
  guessTimer = null;
  const tmpNum = game.randomNum % 13 || 13;
  if (tmpNum < 7 && isBig || tmpNum > 7 && !isBig) {
    game.win = 0;
    setTimeout(onResetClick, 1000);
    return;
  }
  if (tmpNum !== 7) {
    game.win *= 2;
  }
  setTimeout(startGuessTimer, 1000);
}

function judgeResult() {
  const ns = [];
  const ts = [];
  game.cards.forEach(card => {
    ns.push(card[0]);
    ts.push(card[1]);
  });
  if (new Set(ts).size === 1) {
    if (ns[4] - ns[0] === 4 || ns[0] === 1 && ns[1] === 10) return rules[0]; // 同花顺
    return rules[4]; // 同花
  }
  ns.sort((a, b) => a - b);
  switch (new Set(ns).size) {
    case 5:
      if (ns[4] - ns[0] === 4 || ns[0] === 1 && ns[1] === 10) return rules[3]; // 顺子
      return 0; // 什么也不是
    case 2:
      if (ns[0] === ns[3] || ns[1] === ns[4]) return rules[1]; // 四条
      if ( 
        ns[0] === ns[2] && ns[3] === ns[4] || ns[0] === ns[1] && ns[2] === ns[4]
      ) return rules[2]; // 葫芦
    case 3:
      if (
        ns[0] === ns[2] || ns[1] === ns[3] || ns[2] === ns[4]
      ) return rules[5] // 三条
      return rules[6]; // 两对
    case 4:
      for (let i = 1; i < LEN; i++) {
        if (ns[i] === ns[i - 1] && (ns[i] === 1 || ns[i] >= 8)) return rules[7];
      }
      return 0;
    default:
      return 0;
  }
}

</script>

<style scoped lang="scss">
@keyframes zoom {
  from {
    transform: scale(1);
  }
  50% {
    transform: scale(2.2);
  }
  to {
    transform: scale(1);
  }
}
.wrapper {
  width: 100vw;
  min-width: 360px;
  min-height: 100vh;
  box-sizing: border-box;
  color: var(--text-color);
  background: var(--bg-color);
  overflow-y: auto;
  .btn {
    text-align: center;
    border: 1px solid var(--border-color);
    color: #fff;
    font-weight: bold;
    background: rgba(60, 160, 60, .9);
    &:disabled {
      background: rgba(200, 200, 200, .9);
    }
  }
  .header-wrapper {
    border-bottom: 1px solid var(--border-color);
  }
  .game-area {
    max-width: 500px;
    margin: 0 auto;
    .money-area {
      display: flex;
      margin-top: 50px;
      border: 1px solid var(--border-color);
      > div {
        flex: 1 0 30%;
        position: relative;
        text-align: right;
        line-height: 1.8;
        box-sizing: border-box;
        border-right: 1px solid var(--border-color);
        font-size: 15px;
        padding: 18px 14px 2px;
        font-weight: bold;
        &:last-child {
          flex: 1 0 40%;
          border-right: 0 none;
        }
        .title {
          position: absolute;
          top: 1px;
          left: 6px;
          font-size: 13px;
        }
        .money {
          display: inline-block;
          &.zoom {
            animation: 0.5s ease-in-out 0s zoom;
          }
        }
      }
    }
    .card-area {
      padding: 30px 0;
      border: 1px solid var(--border-color);
      border-top: 0 none;
      position: relative;
      .result-win,.result-lose {
        background: var(--mask-color);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: #1a1;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .result-lose {
        color: #a11;
      }
    }
    .opt-area {
      display: flex;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
      border-top: 0 none;
      align-items: center;
      box-sizing: border-box;
      height: 60px;
      .card-wrapper {
        flex: 0 0 16%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .btn {
        flex: 0 0 21%;
        height: 100%;
      }
    }
  }
}
@media only screen and (min-width: 320px) and (max-width: 720px) {
  * {
    user-select: none;
  }
}
</style>
