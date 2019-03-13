import axios from 'axios';

import * as WS from '../common/ws';
import { CustomError } from '../common/errors';

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

    add(state, broadcaster) {
      state.data.push(broadcaster);
      state.data.sort((b1, b2) => -b1.username.localeCompare(b2.username));
    },
    remove(state, username) {
      const index = state.data.findIndex(broadcaster => broadcaster.username === username);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    }
  },
  actions: {
    async $init(context, store) {
      WS.events.addEventListener('broadcasters-add', event => {
        const { username } = event.detail;
        context.commit('add', { username });
      });

      WS.events.addEventListener('broadcasters-remove', event => {
        const { username } = event.detail;
        context.commit('remove', username);
      });

      context.dispatch('update');
    },
    async update(context) {
      context.commit('request');

      try {
        const response = await axios.get(`/api/broadcasters`);
        context.commit('success', response.data);
      } catch (error) {
        console.error(`Failed to update broadcasters.`, error);
        if (error.response) {
          context.commit('failure', error.response.data.message);
        } else {
          context.commit('failure', error.message);
        }
      }
    },
    async add(context, username) {
      try {
        const response = await axios.post(`/api/broadcasters`, { username });
        return response.data;
      } catch (error) {
        console.error(`Failed to add broadcaster '${username}'.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async remove(context, username) {
      try {
        const response = await axios.delete(`/api/broadcaster/${username}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to add broadcaster '${username}'.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    }
  }
};
