import axios from 'axios';
import Vue from 'vue';

import * as WS from '../common/ws';
import { CustomError } from '../common/errors';

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

    add(state, extension) {
      state.data.unshift(extension);
    },
    remove(state, id) {
      const index = state.data.findIndex(ext => ext._id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    start(state, id) {
      const index = state.data.findIndex(ext => ext._id === id);
      if (index !== -1) {
        Vue.set(state.data[index], 'running', true);
      }
    },
    stop(state, id) {
      const index = state.data.findIndex(ext => ext._id === id);
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
        context.commit('remove', extension._id);
      });

      WS.events.addEventListener('extension-start', event => {
        const { extension, broadcaster } = event.detail;
        if (context.state.currentBroadcaster === broadcaster) {
          context.commit('start', extension._id);
        }
      });

      WS.events.addEventListener('extension-stop', event => {
        const { extension, broadcaster } = event.detail;
        if (context.state.currentBroadcaster === broadcaster) {
          context.commit('stop', extension._id);
        }
      });
    },
    async update(context, { page, broadcaster }) {
      context.commit('request', broadcaster);

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extensions?page=${page}&pageSize=10`);
        context.commit('success', response.data);
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
