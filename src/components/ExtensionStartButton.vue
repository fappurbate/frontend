<template>
  <v-btn flat :loading="loading" @click="onClick">
    Start

    <v-dialog v-model="showError" width="400px">
      <v-card>
        <v-card-title primary-title class="headline">
          Error
        </v-card-title>
        <v-card-text>
          Failed to start extension: {{ error }}.
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
  props: ['extension'],
  data: () => ({
    showError: false
  }),
  methods: {
    async onClick() {
      await this.$store.dispatch('extensions/start', { id: this.extension._id });
      if (this.error) {
        this.showError = true;
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.extensions.start.loading,
      error: state => state.extensions.start.error
    })
  }
};
</script>

<style scoped>
</style>
