<template>
  <fragment>
    <Navigation />

    <v-content>
      <Frame v-for="page, index of data" :key="index" :srcdoc="page" />
    </v-content>
  </fragment>
</template>

<script>
import Navigation from '../components/Navigation';
import Frame from '../components/Extension/Frame';

export default {
  components: {
    Navigation,
    Frame
  },
  data: () => ({
    loading: false,
    error: null,
    data: []
  }),
  methods: {
    async getPages(broadcaster) {
      this.loading = true;

      try {
        this.data = await this.$store.dispatch('broadcaster/getStreamPages', {
          broadcaster: this.$route.params.broadcaster
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
    await this.getPages(this.$route.params.broadcaster);
  },
  async beforeRouteUpdate(to, from, next) {
    await this.getPages(to.params.broadcaster);
    next();
  }
}
</script>

<style scoped>
</style>
