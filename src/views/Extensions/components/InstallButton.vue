<template>
  <button class="button is-rounded is-outlined is-primary"
    :loading="loading" @click="onClick">
    Install
  </button>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from 'buefy/dist/components/toast';

export default {
  methods: {
    onClick() {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', '.tar');
      input.addEventListener('input', () => {
        this.onInput(input.files[0]);
        input.remove();
      });
      input.click();
    },
    async onInput(file) {
      if (!file) { return; }

      await this.$store.dispatch('extension/install', { file });
      if (this.error) {
        this.$dialog.alert({
          title: 'Error',
          message: `Failed to install extension: ${this.error}`,
          type: 'is-danger'
        });
      } else {
        Toast.open({
          message: 'Extension installed!',
          type: 'is-success'
        });
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.extension.install.loading,
      error: state => state.extension.install.error
    })
  }
};
</script>

<style scoped>
</style>
