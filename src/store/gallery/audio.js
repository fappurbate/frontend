import axios from 'axios';
import Vue from 'vue';

import * as WS from '../../common/ws';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    data: { items: [], all: false }
  },
  mutations: {
    request(state) {
      state.loading = true;
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

    add(state, audio) {
      state.data.items.push(audio);
    },
    remove(state, id) {
      const index = state.data.items.findIndex(audio => audio.id === id);
      if (index !== -1) {
        state.data.items.splice(index, 1);
      }
    }
  },
  getters: {
    lastId: state => {
      const lastAudio = state.data.items.slice(-1)[0];
      return lastAudio ? lastAudio.createdAt : null;
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('gallery-add', event => {
        context.commit('invalidateAll');

        // const { file } = event.detail;
        //
        // if (file.type === 'audio') {
        //   context.commit('add', file);
        // }
      });

      WS.events.addEventListener('gallery-remove', event => {
        const { file } = event.detail;

        if (file.type === 'audio') {
          context.commit('remove', file.id);
        }
      });
    },
    async update(context, options = {}) {
      const { lastId = null } = options;

      context.commit('request');

      try {
        const data = await context.dispatch('gallery/getAudio', { lastId }, { root: true });
        context.commit('success', { data, append: Boolean(lastId) });
      } catch (error) {
        context.commit('failure', error.message);
      }
    }
  }
};
