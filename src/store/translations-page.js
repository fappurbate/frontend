import axios from 'axios';
import querystring from 'querystring';
import * as WS from '../common/ws';
import { spawnNotification } from '../common/util';
import { Toast } from 'buefy/dist/components/toast';

const CHUNK_SIZE = 20;

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
    // add(state, data) {
    //   state.data = [data, ...state.data];
    // },
    remove(state, data) {
      const { tabId, msgId } = data;

      const index = state.data.findIndex(t => t.tabId === tabId && t.msgId === msgId);
      if (index !== -1) {
        state.data.splice(index, 1);
      }
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('request-translation', async event => {
        const { broadcaster, tabId, msgId, content } = event.detail;

        if (broadcaster !== context.state.currentBroadcaster) { return; }

        // context.commit('add', { broadcaster, tabId, msgId, content });

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
    async update(context, options) {
      const { broadcaster, lastId = null } = options;
      context.commit('request', broadcaster);

      const queryParams = querystring.stringify({
        ...lastId && { lastId },
        limit: CHUNK_SIZE
      });

      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/translations?${queryParams}`);
        context.commit('success', { data: response.data, append: Boolean(lastId) });
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
