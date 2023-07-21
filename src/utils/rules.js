/*
 * @Author      : linye
 * @Created At  : 2023-07-20 17:10:59
 * @Description : 
 */
import { ref, watch } from 'vue';
import { i18n, language } from '../plugins/i18n.js';

export const times = [
  250,
  60,
  20,
  10,
  7,
  5,
  2,
  1
];

function getRules() {
  return [
    i18n('straightflush'),
    i18n('four'),
    i18n('fullhouse'),
    i18n('flush'),
    i18n('straight'),
    i18n('three'),
    i18n('twopairs'),
    i18n('onepair'),
  ].map((title, idx) => ({
    title,
    times: times[idx],
  }));
}

export const rules = ref(getRules());

watch(language, () => {
  rules.value = getRules();
});
