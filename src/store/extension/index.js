import axios from 'axios';

import { CustomError } from '../../common/errors';
import install from './install';

export default {
  namespaced: true,
  actions: {
    $init(context, store) { },
    async start(context, { id, broadcaster }) {
      try {
        await axios.post(`/api/broadcaster/${broadcaster}/extension/${id}/start`);
      } catch (error) {
        console.error(`Failed to start extension.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async stop(context, { id, broadcaster }) {
      try {
        await axios.post(`/api/broadcaster/${broadcaster}/extension/${id}/stop`);
      } catch (error) {
        console.error(`Failed to stop extension.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async remove(context, { id }) {
      try {
        await axios.delete(`/api/extension/${id}`);
      } catch (error) {
        console.error(`Failed to remove extension.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async getPage(context, { id, broadcaster, name }) {
      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extension/${id}/page/${name}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load extension front page.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async getLogs(context, { id, broadcaster }) {
      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extension/${id}/logs?rows=500`);
        return response.data;
      } catch (error) {
        console.error(`Failde to load extension logs.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async getStreamInfo(context, { id, broadcaster }) {
      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extension/${id}/stream`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load extension stream info:`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    install(context, { file }) {
      return context.dispatch('install/do', { file });
    }
  },
  modules: {
    install
  }
};
