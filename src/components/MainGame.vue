<template>
  <div class="wrapper">
    <TopHeader />
    <div class="game-area">
      <RuleArea :result="game.result" />
      <div class="money-area">
        <div>
          <span class="title">{{ i18n('total') }}</span>
          <span class="money" :class="{zoom: game.zoomTotal}">{{ game.total }}</span>
        </div>
        <div>
          <span class="title">{{ i18n('bonus') }}</span>
          <span class="money" :class="{zoom: game.zoomWin}">{{ game.bonus }}</span>
        </div>
        <div>
          <span class="title">{{ i18n('bet') }}</span>
          <button
            @click="changeBet(-1)"
            class="btn"
            :disabled="bet === MIN_BET || game.stage > WAIT || game.animating"
          >
            <i i-carbon-subtract-alt />
          </button>
          <span class="money">{{ bet }}</span>
          <button
            @click="changeBet(1)"
            class="btn"
            :disabled="bet === MAX_BET || game.stage > WAIT || game.animating"
          >
            <i i-carbon-add-alt />
          </button>
        </div>
      </div>
      <div class="card-area">
        <CardItem
          v-for="(card, idx) in game.cards"
          :key="idx"
          :num="NUMS[card[0] - 1] || ''"
          :type="card[1]"
          :hold="game.holds[idx]"
          @click="onCardClick(idx)"
        />
        <div class="result-win" v-if="game.stage >= GUESS">
          🎉🎉 {{ i18n('tipWin') }} 🎉🎉
        </div>
        <div class="result-lose" v-if="game.stage === LOSE">
          👻👻 {{ i18n('tipLost') }} 👻👻
        </div>
      </div>
      <div class="guess-area" ref="guessArea">
        <div class="guess-list">
          <div
            v-for="([num, type, isBig, isWin], idx) in game.guesses"
            :key="idx"
            class="guess-item"
          >
            <CardItem
              :mini="true"
              :num="NUMS[num - 1] || ''"
              :type="type"
            />
            <span
              :class="{
                'guess-result': true,
                'guess-win': isWin > 0,
                'guess-tie': isWin === 0,
                'guess-lose': isWin < 0,
              }"
            >
              {{ i18n(isBig ? 'big' : 'small') }}
            </span>
          </div>
        </div>
        <div class="card-wrapper">
          <CardItem
            :mini="true"
            :num="NUMS[randomCard[0] - 1] || ''"
            :type="randomCard[1]"
          />
        </div>
      </div>
      <div class="opt-area">
        <button
          class="btn"
          :disabled="game.stage !== GUESS"
          @click="guessBigOrSmall(true)"
        >
          {{ i18n('big') }}
        </button>
        <button
          class="btn"
          :disabled="game.stage !== GUESS"
          @click="guessBigOrSmall(false)"
        >
          {{ i18n('small') }}
        </button>
        <button
          class="btn"
          :disabled="game.animating || game.stage < LOSE"
          @click="onResetClick"
        >
          {{ game.stage === GUESS ? i18n('settle') : i18n('reset') }}
        </button>
        <button
          class="btn"
          :disabled="game.animating || game.stage > SECOND"
          @click="onPlayClick"
        >
          {{ game.stage === WAIT ? i18n('roll') : i18n('change') }}
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
import { rulesList } from '../utils/rules.js';
import { bet, changeBet, MIN_BET, MAX_BET } from '../utils/bet.js';

import { TOTAL_KEY, BET_KEY } from '../utils/constants.js';
const LEN = 5;
const CARDS_COUNT = 13 * 4;
const DEFAULT_TOTAL = 1000; // 初始默认资产
const DEAL_INTERVAL = 250; // 发牌动画时间间隔
const GUESS_PER_SECOND = 8; // 猜大小 1 秒闪烁几张牌

// 游戏阶段：初始、第一轮发牌、第二轮发牌、直接输、猜大小、猜大小输
const [ WAIT, FIRST, SECOND, LOSE, GUESS, GUESS_LOSE ] = [0, 1, 2, 3, 4, 5];
// 所有牌的数字，1-52
const ALL_CARDS = new Array(CARDS_COUNT).fill(1).map((_, i) => i + 1);
// 牌点数对应的展示内容
const NUMS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
// 牌的花色：红桃、方片、黑桃、梅花
const TYPES = ['heart', 'diamond', 'spade', 'club'];

const sleep = ms => new Promise(res => setTimeout(res, ms));

// 部分初始游戏数据
const getInitData = () => ({
  bonus: 0, // 奖金金额
  result: 0, // 牌型赔率
  randomNum: 0, // 随机数，1 - 52，0 为牌背
  stage: WAIT, // 游戏处于哪个阶段
  animating: false, // 是否在进行发牌动画
  cards: Array.from({ length: LEN }, () => (['', ''])), // 当前牌型，初始 5 张牌背
  holds: new Array(LEN).fill(false), // 第一次发牌后选择保留的牌下标
  guesses: [], // 猜大小历史记录
  zoomTotal: false, // 总资产金额变化时候 zoom 提示
  zoomWin: false, // 奖金金额变化时 zoom 提示
});

const guessArea = ref(null);

// 游戏状态数据
const game = reactive({
  total: +localStorage.getItem(TOTAL_KEY) || DEFAULT_TOTAL,
  ...getInitData(),
});

// 当前牌型转换为包含 1-52 数字的数组，用于避免随机时重复
const curCards = computed(() => game.cards.map(cardToNum));
// 猜大小随机出来的牌
const randomCard = computed(() => numToCard(game.randomNum));

// 猜大小定时器
let guessTimer = null;

watch(() => game.bonus, val => {
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
  if (all) return Math.ceil(Math.random() * CARDS_COUNT);
  while (true) {
    const val = Math.ceil(Math.random() * CARDS_COUNT);
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
    if (game.total <= 0) {
      alert('破产了请重新来过！');
      game.total = DEFAULT_TOTAL;
    }
    if (game.total >= bet.value) {
      game.total -= bet.value;
    } else {
      bet.value = game.total;
      game.total = 0;
    }
    game.cards = Array.from({ length: LEN }, () => (['', '']));
    const cards = sampleSize(ALL_CARDS, LEN);
    for (let i = 0; i < LEN; i++) {
      await sleep(DEAL_INTERVAL);
      game.cards[i] = numToCard(cards[i]);
    }
  } else if (game.stage === FIRST) {
    game.holds.forEach((val, idx) => {
      if (!val) game.cards[idx] = ['', ''];
    });
    for (let i = 0; i < LEN; i++) {
      if (game.holds[i]) continue;
      await sleep(DEAL_INTERVAL);
      game.cards[i] = numToCard(randomOne());
    }
  }
  game.animating = false;
  game.stage++;
  if (game.stage === SECOND) {
    const res = judgeResult();
    if (!res) {
      game.stage = LOSE;
      return;
    }
    game.stage = GUESS;
    game.result = res.times;
    game.bonus = bet.value * res.times;
  }
}

function onResetClick() {
  if (game.stage === GUESS) {
    game.total += game.bonus;
  }
  Object.assign(game, getInitData());
}

function startGuessTimer() {
  if (game.stage !== GUESS) return;
  guessTimer = setInterval(() => {
    game.randomNum = Math.ceil(Math.random() * CARDS_COUNT);
  }, 1000 / GUESS_PER_SECOND);
}

function guessBigOrSmall(isBig) {
  if (!guessTimer) return;
  const [ tmpNum, tmpType ] = numToCard(game.randomNum);
  console.log({ tmpNum, tmpType });
  let isWin = -1;
  if (tmpNum < 7 && isBig || tmpNum > 7 && !isBig) {
    game.bonus = 0;
    clearInterval(guessTimer);
    game.stage = GUESS_LOSE;
    game.result = 0;
    game.randomNum = 0;
  } else {
    isWin = 0;
    if (tmpNum !== 7) {
      game.bonus *= 2;
      isWin = 1;
    }
  }
  game.guesses.push([ tmpNum, tmpType, isBig, isWin ]);
  guessArea.value.scrollTo(1000, 0);
}

function judgeResult() {
  const ns = [];
  const ts = new Set([]);
  game.cards.forEach(card => {
    ns.push(card[0]);
    ts.add(card[1]);
  });
  ns.sort((a, b) => a - b);
  const [ n1, n2, n3, n4, n5 ] = ns;
  if (ts.size === 1) {
    if (
      n5 - n1 === 4 || n1 === 1 && n2 === 10
    ) return rulesList[0]; // 同花顺
    return rulesList[3]; // 同花
  }
  switch (new Set(ns).size) {
    case 5:
      if (
        n5 - n1 === 4 || n1 === 1 && n2 === 10
      ) return rulesList[4]; // 顺子
      return 0; // 什么也不是
    case 2:
      if (
        n1 === n4 || n2 === n5
      ) return rulesList[1]; // 四条
      if (
        n1 === n3 && n4 === n5 || n1 === n2 && n3 === n5
      ) return rulesList[2]; // 葫芦
    case 3:
      if (
        n1 === n3 || n2 === n4 || n3 === n5
      ) return rulesList[5] // 三条
      return rulesList[6]; // 两对
    case 4:
      for (let i = 1; i < LEN; i++) {
        if (
          ns[i] === ns[i - 1] && (ns[i] === 1 || ns[i] >= 8)
        ) return rulesList[7]; // 大于 8 一对
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
    transform: scale(2.1);
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
    padding: 0;
    background: rgba(60, 160, 60, .9);
    cursor: pointer;
    &:disabled {
      background: rgba(200, 200, 200, .9);
    }
  }
  .header-wrapper {
    border-bottom: 1px solid var(--border-color);
  }
  .game-area {
    max-width: var(--max-width);
    margin: 0 auto;
    .money-area {
      display: flex;
      border: 1px solid var(--border-color);
      border-top: 0 none;
      > div {
        flex: 1 0 33%;
        position: relative;
        text-align: right;
        line-height: 1.8;
        box-sizing: border-box;
        border-right: 1px solid var(--border-color);
        font-size: 15px;
        padding: 22px 10px 2px;
        font-weight: bold;
        &:last-child {
          flex: 1 0 34%;
          border-right: 0 none;
        }
        .title {
          position: absolute;
          top: 0px;
          left: 5px;
          font-size: 14px;
        }
        .money {
          display: inline-block;
          margin: 0 5px;
          &.zoom {
            animation: 0.6s ease-in-out 0s zoom;
          }
        }
        .btn {
          border: 1px solid var(--border-color);
          border-radius: 3px;
          padding: 5px 3px;
        }
      }
    }
    .card-area {
      padding: 25px 0;
      border: 1px solid var(--border-color);
      border-top: 0 none;
      position: relative;
      font-size: 0;
      .result-win,.result-lose {
        background: var(--mask-color);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        color: #1c1;
        font-weight: bold;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .result-lose {
        color: #c11;
      }
    }
    .guess-area {
      padding: 10px 0 25px;
      text-align: left;
      overflow-x: auto;
      border: 1px solid var(--border-color);
      border-top: 0 none;
      font-size: 0;
      white-space: nowrap;
      .guess-list {
        display: inline-block;
        white-space: nowrap;
        .guess-item {
          position: relative;
          display: inline-block;
          font-size: 0;
          .guess-result {
            position: absolute;
            bottom: -20px;
            left: 50%;
            font-size: 12px;
            font-weight: bold;
            transform: translateX(-50%);
            &.guess-win {
              color: #1f1;
            }
            &.guess-lose {
              color: #f11;
            }
            &.guess-tie {
              color: var(--text-color);
            }
          }
        }
      }
      .card-wrapper {
        display: inline-block;
      }
    }
    .opt-area {
      display: flex;
      border: 1px solid var(--border-color);
      border-top: 0 none;
      align-items: center;
      height: 60px;
      margin-bottom: 50px;
      .btn {
        flex: 0 0 25%;
        height: 100%;
        font-size: 16px;
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
