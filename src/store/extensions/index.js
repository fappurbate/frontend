import axios from 'axios';
import Vue from 'vue';

import * as WS from '../../common/ws';
import { CustomError } from '../../common/errors';

import install from './install';

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
      WS.events.addEventListener('extension-remove', event => {
        const { extension } = event.detail;
        context.commit('remove', extension._id);
      })

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
    async update(context, broadcaster) {
      context.commit('request', broadcaster);

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extensions`);
        context.commit('success', response.data);
      } catch (error) {
        console.error(`Failed to update extensions.`, error);
        if (error.response) {
          context.commit('failure', error.response.data);
        } else {
          context.commit('failure', error.message);
        }
      }
    },
    async install(context, { file }) {
      await context.dispatch('install/do', { file });

      if (!context.state.install.error) {
        await context.dispatch('update', context.state.currentBroadcaster);
      }
    },
    async remove(context, { id }) {
      try {
        await axios.delete(`/api/extension/${id}`);
      } catch (error) {
        console.error(`Failed to remove extension.`, error);
        if (error.response) {
          throw new CustomError(error.response.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async start(context, { id }) {
      const broadcaster = context.state.currentBroadcaster;

      try {
        await axios.post(`/api/broadcaster/${broadcaster}/extension/${id}/start`);
      } catch (error) {
        console.error(`Failed to start extension.`, error);
        if (error.response) {
          throw new CustomError(error.response.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async stop(context, { id }) {
      const broadcaster = context.state.currentBroadcaster;

      try {
        await axios.post(`/api/broadcaster/${broadcaster}/extension/${id}/stop`);
      } catch (error) {
        console.error(`Failed to stop extension.`, error);
        if (error.response) {
          throw new CustomError(error.response.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    }
  },
  modules: {
    install
  }
};
