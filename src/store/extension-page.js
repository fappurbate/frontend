import axios from 'axios';
import * as WS from '../common/ws';

export default {
  namespaced: true,
  state: {
    loading: false,
    error: null,
    data: null,

    currentBroadcaster: null,
    removed: false
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
      state.removed = false;
    },
    failure(state, error) {
      state.loading = false;
      state.error = error;
    },

    start(state) {
      if (this.data) {
        Vue.set(state.data, 'running', true);
      }
    },
    stop(state) {
      if (this.data) {
        Vue.set(state.data, 'running', false);
      }
    },
    remove(state) {
      if (this.data) {
        this.removed = true;
      }
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('extension-remove', event => {
        if (!context.state.data) { return; }

        const { extension } = event.detail;
        if (extension._id === context.state.data._id) {
          context.commit('remove');
        }
      });

      WS.events.addEventListener('extension-start', event => {
        if (!context.state.data) { return; }

        const { extension, broadcaster } = event.detail;
        if (extension._id === context.state.data._id &&
            context.state.currentBroadcaster === broadcaster) {
          context.commit('start');
        }
      });

      WS.events.addEventListener('extension-stop', event => {
        if (!context.state.data) { return; }

        const { extension, broadcaster } = event.detail;
        if (extension._id === context.state.data._id &&
            context.state.currentBroadcaster === broadcaster) {
          context.commit('stop');
        }
      });
    },
    async update(context, { id, broadcaster }) {
      context.commit('request', broadcaster);

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extension/${id}`);
        context.commit('success', response.data);
      } catch (error) {
        console.error(`Failed to update extension.`, error);
        if (error.response) {
          context.commit('failure', error.response.data.message);
        } else {
          context.commit('failure', error.message);
        }
      }
    }
  }
};
