<template>
  <Frame :srcdoc="data" />
</template>

<script>
import Frame from '../../components/Extension/Frame';

export default {
  components: {
    Frame
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
        this.data = await this.$store.dispatch('extension/getFrontPage', {
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
