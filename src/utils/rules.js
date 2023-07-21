/*
 * @Author      : linye
 * @Created At  : 2023-07-20 17:10:59
 * @Description : 
 */
import { ref, watch } from 'vue';
import { i18n, language } from '../plugins/i18n.js';

function getRules() {
  return [
    { title: i18n('straightflush'), times: 250 },
    { title: i18n('four'), times: 60 },
    { title: i18n('fullhouse'), times: 20 },
    { title: i18n('flush'), times: 10 },
    { title: i18n('straight'), times: 7 },
    { title: i18n('three'), times: 5 },
    { title: i18n('twopairs'), times: 2 },
    { title: i18n('onepair'), times: 1 },
  ];
}

export const rules = ref(getRules());

watch(language, () => {
  rules.value = getRules();
});
