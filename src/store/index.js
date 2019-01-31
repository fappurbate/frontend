import Vue from 'vue';
import Vuex from 'vuex';

import animations from './animations';
import broadcasters from './broadcasters';
import extensions from './extensions';
import tippers from './tippers';
import translations from './translations';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    store => ['animations', 'broadcasters', 'extensions', 'tippers', 'translations']
      .forEach(ns => store.dispatch(`${ns}/$init`, store))
  ],
  modules: {
    animations,
    broadcasters,
    extensions,
    tippers,
    translations
  }
});

export default store;
