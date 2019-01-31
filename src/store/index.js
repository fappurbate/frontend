import Vue from 'vue';
import Vuex from 'vuex';

import broadcasters from './broadcasters';
import extensions from './extensions';
import tippers from './tippers';
import translations from './translations';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    store => ['broadcasters', 'extensions', 'tippers', 'translations']
      .forEach(ns => store.dispatch(`${ns}/$init`, store))
  ],
  modules: {
    broadcasters,
    extensions,
    tippers,
    translations
  }
});

export default store;
