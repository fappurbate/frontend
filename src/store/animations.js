import axios from 'axios';

import { CustomError } from '../common/errors';

export default {
  namespaced: true,
  actions: {
    $init(context, store) { },
    async getPages(context, broadcaster) {
      try {
        const response = await axios.get(`/api/broadcaster/${broadcaster}/extensions/stream`);
        return response.data;
      } catch (error) {
        console.error(`Failed to load broadcaster stream pages.`);
        if (error.response) {
          throw new CustomError(error.response.data);
        } else {
          throw new CustomError(error.message);
        }
      }
    }
  }
};
