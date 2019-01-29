<template>
  <v-btn flat :loading="loading" @click="onClick">
    Remove

    <v-dialog v-model="showError" width="400px">
      <v-card>
        <v-card-title primary-title class="headline">
          Error
        </v-card-title>
        <v-card-text>
          Failed to remove extension: {{ error }}.
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
  methods: {
    async onClick() {
      this.loading = true;

      try {
        await this.$store.dispatch(`extensions/remove`, { id: this.extension._id });
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
