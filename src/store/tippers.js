import axios from 'axios';
import Vue from 'vue';
import * as WS from '../common/ws';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    data: [],

    currentBroadcaster: null
  },
  mutations: {
    request(state, broadcaster) {
      state.loading = true;
      state.currentBroadcaster = broadcaster;
    },
    success(state, data) {
      state.loading = false;
      state.error = null;
      state.data = data;
    },
    failure(state, error) {
      state.loading = false;
      state.error = error;
    },
    tip(state, data) {
      const { tipper, amount } = data;

      const index = state.data.findIndex(({ username }) => username === tipper);
      if (index !== -1) {
        const oldAmount = state.data[index].amount;
        Vue.set(state.data[index], 'amount', oldAmount + amount);
      } else {
        state.data.push({
          username: tipper,
          amount
        });
      }
      state.data.sort((e1, e2) => e2.amount - e1.amount);
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('tip', event => {
        const { broadcaster, tipper, amount } = event.detail;

        if (broadcaster !== context.state.currentBroadcaster) { return; }

        context.commit('tip', { tipper, amount });
      });
    },
    async update(context, broadcaster) {
      context.commit('request', broadcaster);

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/tippers`);
        context.commit('success', response.data);
      } catch (error) {
        console.error(`Failed to update tippers.`, error);
        if (error.response) {
          context.commit('failure', error.response.data);
        } else {
          context.commit('failure', error.message);
        }
      }
    }
  }
};
