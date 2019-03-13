import axios from 'axios';
import Vue from 'vue';

import * as WS from '../common/ws';
import { CustomError } from '../common/errors';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    data: {},

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

    add(state, { id, page, extension }) {
      Vue.set(state.data, id, { page, extension });
    },
    remove(state, id) {
      Vue.delete(state.data, id);
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('extension-start', async event => {
        const { extension, broadcaster } = event.detail;
        if (context.state.currentBroadcaster === broadcaster) {
          try {
            const page = await context.dispatch('extension/getPage', {
              id: extension.id,
              broadcaster,
              name: 'stream'
            }, { root: true });

            context.commit('add', { id: extension.id, page });
          } catch (error) {
            console.error('Failed to load new stream page :(', error);
          }
        }
      });

      WS.events.addEventListener('extension-stop', event => {
        const { extension, broadcaster } = event.detail;
        if (context.state.currentBroadcaster === broadcaster) {
          context.commit('remove', extension.id);
        }
      });
    },
    async update(context, { broadcaster }) {
      context.commit('request', broadcaster);

      try {
        const data = await context.dispatch('broadcaster/getStreamInfo', {
          broadcaster
        }, { root: true });
        context.commit('success', data);
      } catch (error) {
        console.error(`Failed to load stream info:`, error);
        context.commit('failure', error);
      }
    }
  }
};
