<template>
  <fragment>
    <Navigation />

    <v-content>
      <ExtensionsGrid />
    </v-content>
  </fragment>
</template>

<script>
import Navigation from '../components/Navigation';
import ExtensionsGrid from '../components/ExtensionsGrid';

export default {
  components: {
    Navigation,
    ExtensionsGrid
  },
  created() {
    this.$store.dispatch('extensions/update');
  }
};
</script>

<style scoped>
</style>
