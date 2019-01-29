<template>
  <v-btn outline round small :loading="loading" @click="onClick">
    Install

    <v-dialog v-model="showError" width="400px">
      <v-card>
        <v-card-title primary-title class="headline">
          Error
        </v-card-title>
        <v-card-text>
          Failed to install extension: {{ error }}.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn flat @click="showError = false">
            Dismiss
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    showError: false
  }),
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

      await this.$store.dispatch('extensions/install', { file });
      if (this.error) {
        this.showError = true;
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.extensions.install.loading,
      error: state => state.extensions.install.error
    })
  }
};
</script>

<style scoped>
</style>
