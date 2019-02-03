<template>
  <fragment>
    <Navigation />

    <v-content>
      <Toolbar />
      <Grid />
    </v-content>
  </fragment>
</template>

<script>
import Navigation from '../components/Navigation';
import Toolbar from '../components/Extensions/Toolbar';
import Grid from '../components/Extensions/Grid';

export default {
  components: {
    Navigation,
    Toolbar,
    Grid
  },
  created() {
    this.$store.dispatch('extensionsList/update', this.$route.params.broadcaster);
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('extensionsList/update', to.params.broadcaster);
    next();
  }
};
</script>

<style scoped>
</style>
