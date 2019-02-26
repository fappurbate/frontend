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
    success(state, data) {
      state.loading = false;
      state.error = null;
      state.data = data;
    },
    failure(state, error) {
      state.loading = false;
      state.error = error;
    },

    add(state, audio) {
      if (!state.data) { return; }

      state.data.unshift(audio);
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
    async update(context, { lastId = null }) {
      context.commit('request');

      try {
        const data = await context.dispatch('gallery/getAudio', { lastId }, { root: true });
        context.commit('success', data);
      } catch (error) {
        context.commit('failure', error.message);
      }
    }
  }
};
