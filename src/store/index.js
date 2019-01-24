import Vue from 'vue';
import Vuex from 'vuex';

import broadcasters from './broadcasters';
import tippers from './tippers';
import translations from './translations';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    store => ['broadcasters', 'tippers', 'translations']
      .forEach(ns => store.dispatch(`${ns}/$init`, store))
  ],
  modules: {
    broadcasters,
    tippers,
    translations
  }
});

export default store;
