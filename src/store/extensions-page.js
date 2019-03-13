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

    add(state, extension) {
      state.data.push(extension);
      state.data.sort((i1, i2) => -i1.id.localeCompare(i2.id));
    },
    remove(state, id) {
      const index = state.data.findIndex(ext => ext.id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    start(state, id) {
      const index = state.data.findIndex(ext => ext.id === id);
      if (index !== -1) {
        Vue.set(state.data[index], 'running', true);
      }
    },
    stop(state, id) {
      const index = state.data.findIndex(ext => ext.id === id);
      if (index !== -1) {
        Vue.set(state.data[index], 'running', false);
      }
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
