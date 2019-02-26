import axios from 'axios';
import Vue from 'vue';

import * as WS from '../../common/ws';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    data: [],

    thumbnails: 'small'
  },
  mutations: {
    request(state, options) {
      const { thumbnails } = options;

      state.loading = true;
      state.thumbnails = thumbnails || state.thumbnails;
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

    add(state, image) {
      if (!state.data) { return; }

      // TODO: optimize
      state.data.push(image);
      state.data.sort((i1, i2) => i1.id.localCompare(i2.id));
    },
    remove(state, id) {
      if (!state.data) { return; }

      const index = state.data.findIndex(image => image.id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('gallery-add', event => {
        const { file } = event.detail;

        if (file.type === 'image') {
          context.commit('add', file);
        }
      });

      WS.events.addEventListener('gallery-remove', event => {
        const { file } = event.detail;

        if (file.type === 'image') {
          context.commit('remove', file.id);
        }
      });
    },
    async update(context, options = {}) {
      const { thumbnails, lastId = null } = options;

      context.commit('request', { thumbnails });

      try {
        const data = await context.dispatch('gallery/getImages', { thumbnails, lastId }, { root: true });
        context.commit('success', { data, append: Boolean(lastId) });
      } catch (error) {
        context.commit('failure', error.message);
      }
    }
  }
};
