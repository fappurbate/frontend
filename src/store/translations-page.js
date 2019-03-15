import Vue from 'vue';
import axios from 'axios';
import querystring from 'querystring';
import * as WS from '../common/ws';
import { spawnNotification } from '../common/util';
import { Toast } from '@fappurbate/fappify/dist/components/toast';

const CHUNK_SIZE = 20;

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
        Vue.set(state.data, 'items', [...state.data.items, ...data.items]);
        Vue.set(state.data, 'all', data.all);
      } else {
        state.data = data;
      }
    },
    failure(state, error) {
      state.loading = false;
      state.error = error;
    },
    invalidateAll(state) {
      Vue.set(state.data, 'all', false);
    },


    add(state, data) {
      state.data.items.unshift(data);
    },
    remove(state, data) {
      const { tabId, msgId } = data;

      const index = state.data.items.findIndex(t => t.tabId === tabId && t.msgId === msgId);
      if (index !== -1) {
        state.data.items.splice(index, 1);
      }
    }
  },
  getters: {
    lastId: state => {
      const lastTranslation = state.data.items.slice(-1)[0];
      return lastTranslation ? lastTranslation.createdAt : null;
    }
  },
  actions: {
    $init(context, store) {
      WS.events.addEventListener('request-translation', async event => {
        const { broadcaster, tabId, msgId, content, createdAt } = event.detail;

        if (broadcaster !== context.state.currentBroadcaster) { return; }

        context.commit('add', { broadcaster, tabId, msgId, content, createdAt });

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
