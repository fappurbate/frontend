import images from './images';
import audio from './audio';

export default {
  namespaced: true,
  actions: {
    async $init(context, store) {
      await Promise.all([
        context.dispatch('images/$init', store),
        context.dispatch('audio/$init', store)
      ]);
    }
  },
  modules: {
    images,
    audio
  }
};
