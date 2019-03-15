import axios from 'axios';
import querystring from 'querystring';
import Vue from 'vue';

import * as WS from '../common/ws';
import { CustomError } from '../common/errors';

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

    add(state, extension) {
      state.data.items.unshift(extension);
    },
    remove(state, id) {
      const index = state.data.items.findIndex(ext => ext.id === id);
      if (index !== -1) {
        state.data.items.splice(index, 1);
      }
    },

    start(state, id) {
      const index = state.data.items.findIndex(ext => ext.id === id);
      if (index !== -1) {
        Vue.set(state.data.items[index], 'running', true);
      }
    },
    stop(state, id) {
      const index = state.data.items.findIndex(ext => ext.id === id);
      if (index !== -1) {
        Vue.set(state.data.items[index], 'running', false);
      }
    }
  },
  getters: {
    lastId: state => {
      const lastExtension = state.data.items.slice(-1)[0];
      return lastExtension ? lastExtension.createdAt : null
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('extension-install', event => {
        const { extension } = event.detail;
        context.commit('add', extension);
      });

      WS.events.addEventListener('extension-remove', event => {
        const { extension } = event.detail;
        context.commit('remove', extension.id);
      });

      WS.events.addEventListener('extension-start', event => {
        const { extension, broadcaster } = event.detail;
        if (context.state.currentBroadcaster === broadcaster) {
          context.commit('start', extension.id);
        }
      });

      WS.events.addEventListener('extension-stop', event => {
        const { extension, broadcaster } = event.detail;
        if (context.state.currentBroadcaster === broadcaster) {
          context.commit('stop', extension.id);
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
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extensions?${queryParams}`);
        context.commit('success', { data: response.data, append: Boolean(lastId) });
      } catch (error) {
        console.error(`Failed to update extensions.`, error);
        if (error.response) {
          context.commit('failure', error.response.data.message);
        } else {
          context.commit('failure', error.message);
        }
      }
    }
  }
};
