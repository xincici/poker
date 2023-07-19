<template>
  <div class="wrapper" :class="theme">
    <TopHeader />
    <div class="game-area">
      <div class="money-area">
        <div><span class="title">Total</span>1000</div>
        <div><span class="title">Win</span>10</div>
        <div><span class="title">Bet</span>10</div>
      </div>
      <div class="rule-area">
        <div class="rule"><span>同花顺</span><span>250</span></div>
        <div class="rule"><span>四条</span><span>60</span></div>
        <div class="rule"><span>葫芦</span><span>20</span></div>
        <div class="rule"><span>顺子</span><span>10</span></div>
        <div class="rule"><span>同花</span><span>7</span></div>
        <div class="rule"><span>三条</span><span>5</span></div>
        <div class="rule"><span>两对</span><span>2</span></div>
        <div class="rule"><span>大于8一对</span><span>1</span></div>
      </div>
      <div class="card-area">
        <CardItem num="5" type="heart" />
        <CardItem num="A" type="diamond" />
        <CardItem />
        <CardItem num="J" type="spade" />
        <CardItem num="Q" type="club" />
      </div>
      <div class="opt-area">
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue';

import TopHeader from './TopHeader.vue';
import CardItem from './CardItem.vue';
import { theme } from '../utils/theme';
import confetti from '../utils/confetti';

</script>

<style scoped lang="scss">
.wrapper {
  width: 100vw;
  min-width: 360px;
  min-height: 100vh;
  box-sizing: border-box;
  color: #2c3e50;
  overflow-y: auto;
  &.dark {
    background: #444;
    color: #eee;
    .header-wrapper {
      border-bottom: 1px solid #333;
    }
    .game-area {
    }
  }
  .header-wrapper {
    border-bottom: 1px solid #eee;
  }
  .game-area {
    max-width: 500px;
    margin: 0 auto;
    .money-area {
      display: flex;
      border: 1px solid #eee;
      border-width: 0 1px 1px;
      div {
        flex: 1 0 30%;
        position: relative;
        text-align: right;
        line-height: 1.8;
        box-sizing: border-box;
        border-right: 1px solid #eee;
        font-size: 18px;
        padding: 3px 15px;
        font-weight: bold;
        &:last-child {
          flex: 1 0 40%;
          border-right: 0 none;
        }
        .title {
          position: absolute;
          top: 2px;
          left: 8px;
          font-size: 14px;
        }
      }
    }
    .rule-area {
      display: flex;
      flex-wrap: wrap;
      .rule {
        flex: 1 0 50%;
        line-height: 1.6;
        display: flex;
        padding: 0;
        box-sizing: border-box;
        justify-content: space-between;
        padding: 0 10px;
        &:nth-child(odd) {
          padding-right: 15px;
        }
        &:nth-child(even) {
          padding-left: 15px;
        }
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
