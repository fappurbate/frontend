import axios from 'axios';
import querystring from 'querystring';

const CHUNK_SIZE = 2;

export default {
  namespaced: true,
  actions: {
    $init(context, store) { },
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
    }
  }
};
