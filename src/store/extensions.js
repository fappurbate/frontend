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
    },
    add(state, extension) {
      state.data.unshift(extension);
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
        console.error(`Failed to update extensions.`, error);
        if (error.response) {
          context.commit('failure', error.response.data);
        } else {
          context.commit('failure', error.message);
        }
      }
    },
    async remove(context, id) {
      context.commit('remove', id);

      try {
        await axios.delete(`/api/extension/${id}`);
      } catch (error) {
        console.error(`Failed to remove extension.`, error);
      }
    },
    async install(context, data) {
      await context.dispatch('install/do', data);

      if (!context.state.install.error) {
        await context.dispatch('update');
      }
    }
  },
  modules: {
    install: {
      namespaced: true,
      state: {
        loading: false,
        error: null
      },
      mutations: {
        request(state) {
          state.loading = true;
        },
        success(state) {
          state.loading = false;
          state.error = null;
        },
        failure(state, error) {
          state.loading = false;
          state.error = error;
        }
      },
      actions: {
        async do(context, data) {
          context.commit('request');

          const { file } = data;

          try {
            const formData = new FormData;
            formData.append('extension', file);

            const response = await axios.post(`/api/extensions`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
            context.commit('success');
          } catch (error) {
            console.error(`Failed to install extension.`, error);
            if (error.response) {
              context.commit('failure', error.response.data);
            } else {
              context.commit('failure', error.message);
            }
          }
        }
      }
    }
  }
};
