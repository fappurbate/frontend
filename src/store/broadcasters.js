import axios from 'axios';

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
    }
  },
  actions: {
    $init(context, store) { },
    async update(context) {
      context.commit('request');

      try {
        const response = await axios.get(`/api/broadcasters`);
        context.commit('success', response.data);
      } catch (error) {
        context.commit('failure', error.response.data);
      }
    }
  }
}
