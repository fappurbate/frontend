import axios from 'axios';
import querystring from 'querystring';
import Vue from 'vue';

import { CustomError } from '../../common/errors';
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
      state.data.push(image);
      state.data.sort((i1, i2) => -i1.id.localeCompare(i2.id));
    },
    remove(state, id) {
      const index = state.data.findIndex(image => image.id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('gallery-add', async event => {
        const { file } = event.detail;

        if (file.type === 'image') {
          const thumbnail = await context.dispatch('getThumbnail', {
            fileId: file.id
          });
          file.thumbnail = thumbnail;

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
    },
    async getThumbnail(context, options) {
      const { fileId, size } = options;

      const queryParams = querystring.stringify({ size: size || context.state.thumbnails });

      try {
        const response = await axios.get(`/api/gallery/${fileId}/thumbnail?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load image thumbnail from gallery.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async getPreview(context, options) {
      const { fileId, encoding } = options;

      const queryParams = querystring.stringify({ ...encoding && { encoding } });

      try {
        const response = await axios.get(`/api/gallery/${fileId}/preview?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load image preview from gallery.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    }
  }
};
