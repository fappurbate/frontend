import axios from 'axios';
import querystring from 'querystring';
import Vue from 'vue';
import * as WS from '../common/ws';

const CHUNK_SIZE = 20;

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
    success(state, { data, append = false }) {
      state.loading = false;
      state.error = null;

      if (append) {
        state.data = [...state.data, ...data];
      } else {
        state.data = data;
      }
    },
    failure(state, error) {
      state.loading = false;
      state.error = error;
    },
    tip(state, data) {
      if (!state.data) { return; }

      const { tipper, amount } = data;

      const index = state.data.findIndex(({ username }) => username === tipper);
      if (index !== -1) {
        const oldAmount = state.data[index].amount;
        Vue.set(state.data[index], 'amount', oldAmount + amount);
      }
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
    async update(context, options) {
      const { broadcaster, lastId = null } = options;

      context.commit('request', broadcaster);

      const queryParams = querystring.stringify({
        ...lastId && { lastId },
        limit: CHUNK_SIZE
      });

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/tippers?${queryParams}`);
        context.commit('success', { data: response.data, append: Boolean(lastId) });
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
