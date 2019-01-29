<template>
  <fragment>
    <Navigation />

    <v-content>
      <ExtensionsToolbar />
      <ExtensionsGrid />
    </v-content>
  </fragment>
</template>

<script>
import Navigation from '../components/Navigation';
import ExtensionsToolbar from '../components/ExtensionsToolbar';
import ExtensionsGrid from '../components/ExtensionsGrid';

export default {
  components: {
    Navigation,
    ExtensionsToolbar,
    ExtensionsGrid
  },
  created() {
    this.$store.dispatch('extensions/update', this.$route.params.broadcaster);
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('extensions/update', to.params.broadcaster);
    next();
  }
};
</script>

<style scoped>
</style>
