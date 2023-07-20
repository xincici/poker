<template>
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
</template>

<script setup>

</script>

<style scoped lang="scss">
.rule-area {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid var(--border-color);
  border-top: 0 none;
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
</style>
