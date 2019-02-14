import axios from 'axios';
import * as WS from '../common/ws';
import { spawnNotification } from '../common/util';
import { Toast } from 'buefy/dist/components/toast'

const sym = Symbol();

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
    add(state, data) {
      if (!state.data) { return; }

      state.data.rows = [data, ...state.data.rows];
    },
    remove(state, data) {
      if (!state.data) { return; }

      const { tabId, msgId } = data;

      const index = state.data.rows.findIndex(t => t.tabId === tabId && t.msgId === msgId);
      if (index !== -1) {
        state.data.rows.splice(index, 1);
      }
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('request-translation', async event => {
        const { broadcaster, tabId, msgId, content } = event.detail;

        if (broadcaster !== context.state.currentBroadcaster) { return; }

        context.commit('add', { broadcaster, tabId, msgId, content });

        Toast.open({
          message: 'New translation request!',
          type: 'is-info'
        });

        const notification = await spawnNotification('New Translation Request', {
          body: content,
          icon: '/logo.png',
          requireInteraction: true,
          renotify: true,
          tag: 'new-translation-request'
        });
        if (notification) {
          notification.addEventListener('click', () => {
            window.focus();
            notification.close();
          });
        }
      });

      WS.events.addEventListener('request-cancel-translation', event => {
        const { tabId, msgId } = event.detail;

        context.commit('remove', { tabId, msgId });
      });
    },
    async update(context, broadcaster) {
      context.commit('request', broadcaster);

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/translations`);
        context.commit('success', response.data);
      } catch (error) {
        console.error(`Failed to update translations.`, error);
        if (error.response) {
          context.commit('failure', error.response.data.message);
        } else {
          context.commit('failure', error.message);
        }
      }
    },
    translate(context, data) {
      const { tabId, msgId, translation } = data;

      context.commit('remove', { tabId, msgId });
      WS.emit('translation', { tabId, msgId, content: translation });
    }
  }
};
