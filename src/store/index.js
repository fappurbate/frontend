import Vue from 'vue';
import Vuex from 'vuex';

import animationPage from './animation-page';
import broadcaster from './broadcaster';
import broadcasters from './broadcasters';
import extension from './extension';
import extensionPage from './extension-page';
import extensionsPage from './extensions-page';
import fileSelectionDialog from './file-selection-dialog';
import gallery from './gallery';
import tippersPage from './tippers-page';
import translationsPage from './translations-page';

Vue.use(Vuex);

const store = new Vuex.Store({
  plugins: [
    store => ['animationPage', 'broadcaster', 'broadcasters', 'extension',
        'extensionPage', 'extensionsPage', 'fileSelectionDialog', 'gallery',
        'tippersPage', 'translationsPage']
      .forEach(ns => store.dispatch(`${ns}/$init`, store))
  ],
  modules: {
    animationPage,
    broadcaster,
    broadcasters,
    extension,
    extensionPage,
    extensionsPage,
    fileSelectionDialog,
    gallery,
    tippersPage,
    translationsPage
  }
});

export default store;
