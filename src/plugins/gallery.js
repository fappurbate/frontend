import Vue from 'vue';

Vue.use({
  install(Vue, options) {
    Object.defineProperty(Vue.prototype, '$gallery', {
      get() {
        return {
          select: (options = {}) => this.$store.dispatch('fileSelectionDialog/open', options)
        };
      }
    });
  }
});
