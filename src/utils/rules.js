/*
 * @Author      : linye
 * @Created At  : 2023-07-20 17:10:59
 * @Description : 
 */
import { ref, watch } from 'vue';
import { i18n, language } from '../plugins/i18n.js';

export const rulesList = [
  { times: 250, key: 'straightflush' },
  { times: 60, key: 'four'},
  { times: 20, key: 'fullhouse'},
  { times: 10, key: 'flush'},
  { times: 7, key: 'straight'},
  { times: 5, key: 'three'},
  { times: 2, key: 'twopairs'},
  { times: 1, key: 'onepair'},
];

function getRules() {
  return rulesList.map(item => ({
    title: i18n(item.key),
    times: item.times, 
  }));
}

export const rules = ref(getRules());

watch(language, () => {
  rules.value = getRules();
});
