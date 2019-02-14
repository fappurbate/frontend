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
      if (!state.data) { return; }

      const { tipper, amount } = data;

      const index = state.data.rows.findIndex(({ username }) => username === tipper);
      if (index !== -1) {
        const oldAmount = state.data.rows[index].amount;
        Vue.set(state.data.rows[index], 'amount', oldAmount + amount);
      } else {
        state.data.rows.push({
          username: tipper,
          amount
        });
      }
      state.data.rows.sort((e1, e2) => e2.amount - e1.amount);
      Vue.set(state.data, 'rows', state.data.rows.slice(0, state.data.pageSize));
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('message', event => {
        const { info, type, timestamp, data } = event.detail;

        if (type === 'tip') {
          const { username, amount } = data;

          if (info.chat.owner !== context.state.currentBroadcaster) { return; }
          if (!info.chat.ready) { return; }

          context.commit('tip', { tipper: username, amount });
        }
      });
    },
    async update(context, { page, broadcaster }) {
      context.commit('request', broadcaster);

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/tippers?page=${page}&pageSize=50`);
        context.commit('success', response.data);
      } catch (error) {
        console.error(`Failed to update tippers.`, error);
        if (error.response) {
          context.commit('failure', error.response.data.message);
        } else {
          context.commit('failure', error.message);
        }
      }
    }
  }
};
