import Vue from 'vue';
import Vuex from 'vuex';

import animationPage from './animation-page';
import broadcaster from './broadcaster';
import broadcasters from './broadcasters';
import extension from './extension';
import extensionPage from './extension-page';
import extensionsPage from './extensions-page';
import tippers from './tippers';
import translations from './translations';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    store => ['animationPage', 'broadcaster', 'broadcasters', 'extension',
        'extensionPage', 'extensionsPage', 'tippers', 'translations']
      .forEach(ns => store.dispatch(`${ns}/$init`, store))
  ],
  modules: {
    animationPage,
    broadcaster,
    broadcasters,
    extension,
    extensionPage,
    extensionsPage,
    tippers,
    translations
  }
});

export default store;
