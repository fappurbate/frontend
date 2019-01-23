import Vue from 'vue';
import Vuex from 'vuex';

import broadcasters from './broadcasters';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    broadcasters
  }
});
