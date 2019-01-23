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
    async update() {
      this.commit('broadcasters/request');

      try {
        const response = await axios.get(`http://${window.location.host}/api/broadcasters`);
        this.commit('broadcasters/success', response.data);
      } catch (error) {
        this.commit('broadcasters/failure', error.response.data);
      }
    }
  }
}
