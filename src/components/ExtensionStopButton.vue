<template>
  <v-btn flat :loading="loading" @click="onClick">
    Stop

    <v-dialog v-model="showError" width="400px">
      <v-card>
        <v-card-title primary-title class="headline">
          Error
        </v-card-title>
        <v-card-text>
          Failed to stop extension: {{ error }}.
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
      await this.$store.dispatch('extensions/stop', { id: this.extension._id });
      if (this.error) {
        this.showError = true;
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.extensions.stop.loading,
      error: state => state.extensions.stop.error
    })
  }
};
</script>

<style scoped>
</style>
