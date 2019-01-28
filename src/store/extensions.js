import axios from 'axios';
import Vue from 'vue';

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

    remove(state, id) {
      const index = state.data.findIndex(ext => ext._id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    }
  },
  actions: {
    $init(context, store) { },
    async update(context) {
      context.commit('request');

      try {
        const response = await axios.get(`/api/extensions`);
        context.commit('success', response.data);
      } catch (error) {
        context.commit('failure', error.response.data);
      }
    },
    async remove(context, id) {
      context.commit('remove', id);

      try {
        await axios.delete(`/api/extension/${id}`);
      } catch (error) {
        console.error(`Failed to remove extension.`, error);
      }
    }
  }
};
