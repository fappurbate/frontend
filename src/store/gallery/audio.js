import axios from 'axios';
import Vue from 'vue';

import * as WS from '../../common/ws';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    data: []
  },
  mutations: {
    request(state) {
      state.loading = true;
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

    add(state, audio) {
      if (!state.data) { return; }

      // TODO: optimize
      state.data.push(audio);
      state.data.sort((a1, a2) => a1.id.localCompare(a2.id));

    },
    remove(state, id) {
      if (!state.data) { return; }

      const index = state.data.findIndex(audio => audio.id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('gallery-add', event => {
        const { file } = event.detail;

        if (file.type === 'audio') {
          context.commit('add', file);
        }
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
