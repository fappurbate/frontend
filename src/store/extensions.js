import axios from 'axios';
import Vue from 'vue';
import * as WS from '../common/ws';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    data: [],

    currentBroadcaster: null
  },
  mutations: {
    request(state, broadcaster) {
      state.loading = true;
      state.currentBroadcaster = broadcaster;
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

    add(state, extension) {
      state.data.unshift(extension);
    },
    remove(state, id) {
      const index = state.data.findIndex(ext => ext._id === id);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    },

    start(state, id) {
      const index = state.data.findIndex(ext => ext._id === id);
      if (index !== -1) {
        Vue.set(state.data[index], 'running', true);
      }
    },
    stop(state, id) {
      const index = state.data.findIndex(ext => ext._id === id);
      if (index !== -1) {
        Vue.set(state.data[index], 'running', false);
      }
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('extension-start', event => {
        const { extension } = event.detail;
        context.commit('start', extension._id);
      });

      WS.events.addEventListener('extension-stop', event => {
        const { extension } = event.detail;
        context.commit('stop', extension._id);
      });
    },
    async update(context, broadcaster) {
      context.commit('request', broadcaster);

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extensions`);
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
    async install(context, { file }) {
      await context.dispatch('install/do', { file });

      if (!context.state.install.error) {
        await context.dispatch('update', context.state.currentBroadcaster);
      }
    },
    async remove(context, { id }) {
      context.commit('remove', id);

      try {
        await axios.delete(`/api/extension/${id}`);
      } catch (error) {
        console.error(`Failed to remove extension.`, error);
      }
    },
    async start(context, { id }) {
      await context.dispatch('start/do', {
        id,
        broadcaster: context.state.currentBroadcaster
      });

      if (!context.state.start.error) {
        await context.commit('start', id);
      }
    },
    async stop(context, { id }) {
      await context.dispatch('stop/do', {
        id,
        broadcaster: context.state.currentBroadcaster
      });

      if (!context.state.stop.error) {
        await context.commit('stop', id);
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
    },
    start: {
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

          const { id, broadcaster } = data;

          try {
            await axios.post(`/api/broadcaster/${broadcaster}/extension/${id}/start`);
            context.commit('success');
          } catch (error) {
            console.error(`Failed to start extension.`, error);
            if (error.response) {
              context.commit('failure', error.response.data);
            } else {
              context.commit('failure', error.message);
            }
          }
        }
      },
    },
    stop: {
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

          const { id, broadcaster } = data;

          try {
            await axios.post(`/api/broadcaster/${broadcaster}/extension/${id}/stop`);
            context.commit('success');
          } catch (error) {
            console.error(`Failed to stop extension.`, error);
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
