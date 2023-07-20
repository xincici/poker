<template>
  <div class="wrapper" :class="theme">
    <TopHeader />
    <div class="game-area">
      <div class="money-area">
        <div><span class="title">Total</span>1000</div>
        <div><span class="title">Win</span>10</div>
        <div><span class="title">Bet</span>10</div>
      </div>
      <RuleArea />
      <div class="card-area">
        <CardItem
          v-for="(card, idx) in game.cards"
          :key="idx"
          :num="getNumStr(card[0])"
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
          <button class="btn" @click="onPlayClick">
            {{ game.stage === WAIT ? 'Roll' : 'Change' }}
          </button>
          <button class="btn" @click="onResetClick">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, unref, reactive, computed, watch, watchEffect } from 'vue';
import sampleSize from 'lodash.samplesize';

import TopHeader from './TopHeader.vue';
import RuleArea from './RuleArea.vue';
import CardItem from './CardItem.vue';
import { theme } from '../utils/theme';
import confetti from '../utils/confetti';

const INIT_TOTAL = 1000;
const INIT_BET = 10;
const LEN = 5;
const [ WAIT, FIRST, SECOND, GUESS ] = [0, 1, 2, 3];
const ALL_CARDS = new Array(13 * 4).fill(1).map((_, i) => i);
const TYPES = ['heart', 'diamond', 'spade', 'club'];

const sleep = ms => new Promise(res => setTimeout(res, ms));

const getInitData = () => ({
  win: 0,
  stage: WAIT,
  animating: false,
  cards: Array.from({ length: LEN }, () => (['', ''])),
  holds: new Array(LEN).fill(false),
});

const game = reactive({
  total: INIT_TOTAL,
  bet: INIT_BET,
  ...getInitData(),
});

const curCards = computed(() => game.cards.map(cardToNum));

function numToCard(val) {
  const num = val % 13 + 1;
  const type = TYPES[~~(val / 13)];
  return [ num, type ];
}
function cardToNum(card) {
  const [ num, type ] = card;
  return TYPES.indexOf(type) * 13 + num;
}

function randomOne() {
  while (true) {
    const val = ~~(Math.random() * 52);
    if (!curCards.value.includes(val)) return val;
  }
}

function onCardClick(idx) {
  if (game.stage !== FIRST) return;
  game.holds[idx] = !game.holds[idx];
}

async function onPlayClick() {
  if (game.animating) return;
  game.animating = true;
  if (game.stage === WAIT) {
    game.cards = Array.from({ length: LEN }, () => (['', '']));
    const cards = sampleSize(ALL_CARDS, LEN);
    for (let i = 0; i < LEN; i++) {
      await sleep(250);
      game.cards[i] = numToCard(cards[i]);
    }
  } else if (game.stage === FIRST) {
    game.holds.forEach((val, idx) => {
      if (val) game.cards[idx] = ['', ''];
    });
    for (let i = 0; i < LEN; i++) {
      if (!game.holds[i]) continue;
      await sleep(250);
      game.cards[i] = numToCard(randomOne());
      game.holds[i] = false;
    }
  }
  game.animating = false;
  game.stage++;
}

function onResetClick() {
  Object.assign(game, getInitData());
}

function getNumStr(num) {
  num = +num;
  if (num === 1) return 'A';
  if (num >= 2 && num <= 10) return String(num);
  if (num === 11) return 'J';
  if (num === 12) return 'Q';
  if (num === 13) return 'K';
  return '';
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
    &[disabled] {
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
