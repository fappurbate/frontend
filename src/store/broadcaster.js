import axios from 'axios';

export default {
  namespaced: true,
  actions: {
    $init(context, store) { },
    async getStreamPages(context, { broadcaster }) {
      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extensions/stream`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load broadcaster stream pages.`, error);
        if (error.response) {
          throw new CustomError(error.response.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    }
  }
};
