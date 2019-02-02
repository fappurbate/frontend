<template>
  <ExtensionPage :srcdoc="data" />
</template>

<script>
import ExtensionPage from '../../components/ExtensionPage';

export default {
  components: {
    ExtensionPage
  },
  data: () => ({
    loading: false,
    error: null,
    data: []
  }),
  methods: {
    async getPage(broadcaster) {
      this.loading = true;

      try {
        this.data = await this.$store.dispatch('extensions/getSettingsPage', {
          id: this.$route.params.extensionId,
          broadcaster
        });
        this.error = null;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    await this.getPage(this.$route.params.broadcaster);
  },
  async beforeRouteUpdate(to, from, next) {
    await this.getPage(to.params.broadcaster);
    next();
  }
};
</script>

<style scoped>
</style>
