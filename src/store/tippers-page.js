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
    data: { items: [], all: false },

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
        Vue.set(state.data, 'items', [...state.data.items, ...data.items]);
        Vue.set(state.data, 'all', data.all);
      } else {
        state.data = data;
      }
    },
    failure(state, error) {
      state.loading = false;
      state.error = error;
    },
    invalidateAll(state) {
      Vue.set(state.data, 'all', false);
    },

    tip(state, data) {
      const { tipper, amount } = data;

      const index = state.data.items.findIndex(({ username }) => username === tipper);
      if (index !== -1) {
        const oldAmount = state.data.items[index].amount;
        Vue.set(state.data.items[index], 'amount', oldAmount + amount);
      }
    }
  },
  getters: {
    lastId: state => {
      const lastTipper = state.data.items.slice(-1)[0];
      return lastTipper ? lastTipper.username : null;
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
