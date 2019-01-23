import Vue from 'vue';
import Vuex from 'vuex';

import broadcasters from './broadcasters';
import tippers from './tippers';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    broadcasters,
    tippers
  }
});
