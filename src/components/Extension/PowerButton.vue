<template>
  <v-btn flat :loading="loading" @click="onClick">
    {{ running ? 'Stop' : 'Start' }}

    <v-dialog v-model="showError" width="400px">
      <v-card>
        <v-card-title primary-title class="headline">
          Error
        </v-card-title>
        <v-card-text>
          Failed to {{ running ? 'stop' : 'start' }} extension: {{ error }}
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
    loading: false,
    error: null,
    showError: false
  }),
  computed: {
    running: state => state.extension.running
  },
  methods: {
    async onClick() {
      this.loading = true;

      const action = this.running ? 'stop' : 'start';

      try {
        await this.$store.dispatch(`extension/${action}`, {
          id: this.extension._id,
          broadcaster: this.$route.params.broadcaster
        });
        this.error = null;
      } catch (error) {
        this.error = error.message;
        this.showError = true;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
</style>
