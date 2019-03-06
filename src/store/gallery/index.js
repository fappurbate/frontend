import querystring from 'querystring';
import axios from 'axios';

import { CustomError } from '../../common/errors';
import images from './images';
import audio from './audio';
import upload from './upload';

const CHUNK_SIZE = 10;

export default {
  namespaced: true,
  actions: {
    async $init(context, store) {
      await Promise.all([
        context.dispatch('images/$init', store),
        context.dispatch('audio/$init', store),
        context.dispatch('upload/$init', store)
      ]);
    },
    async getImages(context, { thumbnails, lastId = null }) {
      const queryParams = querystring.stringify({
        ...typeof thumbnails !== 'undefined' && { thumbnails },
        ...lastId && { lastId },
        limit: CHUNK_SIZE
      });

      try {
        const response = await axios.get(`/api/gallery/images?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load images from gallery.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async getAudio(context, { lastId = null }) {
      const queryParams = querystring.stringify({
        limit: CHUNK_SIZE,
        ...lastId && { lastId }
      });

      try {
        const response = await axios.get(`/api/gallery/audio?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load audio from gallery.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async getFile(context, options) {
      const { fileId, encoding } = options;

      const queryParams = querystring.stringify({ ...encoding && { encoding } });

      try {
        const response = await axios.get(`/api/gallery/${fileId}?${queryParams}`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load file from gallery.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async removeFile(context, options) {
      const { fileId } = options;

      try {
        await axios.delete(`/api/gallery/${fileId}`);
      } catch (error) {
        console.error(`Failed to remove file from gallery.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    async getMetadata(context, options) {
      const { fileId } = options;

      try {
        const response = await axios.get(`/api/gallery/${fileId}/metadata`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load metadata from gallery.`, error);
        if (error.response) {
          throw new CustomError(error.response.data.message, error.response.data.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    },
    upload(context, data) {
      return context.dispatch('upload/do', data);
    }
  },
  modules: {
    images,
    audio,
    upload
  }
};
