<template>
  <div class="wrapper" :class="theme">
    <TopHeader />
    <div class="game-area">
      <div class="money-area">
        <div><span class="title">Total</span>{{ game.total }}</div>
        <div><span class="title">Win</span>{{ game.win }}</div>
        <div><span class="title">Bet</span>{{ game.bet }}</div>
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
      </div>
      <div class="opt-area">
        <div class="opt-area-left">
          <button class="btn">Big</button>
          <button class="btn">Small</button>
        </div>
        <div class="opt-area-right">
          <button
            class="btn"
            :disabled="game.animating || game.stage > SECOND"
            @click="onPlayClick"
          >
            {{ game.stage === WAIT ? 'Roll' : 'Change' }}
          </button>
          <button
            class="btn"
            :disabled="game.animating || game.stage < GUESS"
            @click="onResetClick"
          >
            {{ game.stage === GUESS ? 'Settle' : 'Reset' }}
          </button>
        </div>
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
import { theme } from '../utils/theme.js';
import confetti from '../utils/confetti.js';
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
  stage: WAIT,
  animating: false,
  cards: Array.from({ length: LEN }, () => (['', ''])),
  holds: new Array(LEN).fill(false),
});

const game = reactive({
  total: initTotal.value,
  bet: initBet.value,
  ...getInitData(),
});

const curCards = computed(() => game.cards.map(cardToNum));

watchEffect(() => {
  localStorage.setItem(TOTAL_KEY, game.total);
  localStorage.setItem(BET_KEY, game.bet);
});

function numToCard(val) {
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
.wrapper {
  --border-color: #eee;
  --text-color: #2c3e50;
  --bg-color: #fff;
  &.dark {
    --border-color: #444;
    --text-color: #eee;
    --bg-color: #333;
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
    padding: 8px 0;
    width: 70px;
    text-align: center;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    color: #fff;
    font-weight: bold;
    background: rgba(60, 160, 60, .9);
    &:disabled {
      background: rgba(150, 200, 150, .4);
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
      border: 1px solid var(--border-color);
      border-top: 0 none;
      div {
        flex: 1 0 30%;
        position: relative;
        text-align: right;
        line-height: 1.8;
        box-sizing: border-box;
        border-right: 1px solid var(--border-color);
        font-size: 15px;
        padding: 2px 12px;
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
      }
    }
    .card-area {
      padding: 20px 0;
      border: 1px solid var(--border-color);
      border-top: 0 none;
    }
    .opt-area {
      display: flex;
      border: 1px solid var(--border-color);
      border-top: 0 none;
      &-left {
        border-right: 1px solid var(--border-color);
      }
      &-left,&-right {
        flex: 1 0 50%;
        box-sizing: border-box;
        padding: 4px 12px;
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
