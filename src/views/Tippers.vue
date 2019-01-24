<template>
  <fragment>
    <Navigation></Navigation>

    <v-content>
      <v-container>
        <TippersList />
      </v-container>
    </v-content>
  </fragment>
</template>

<script>
import Navigation from '../components/Navigation';
import TippersList from '../components/TippersList';

export default {
  components: {
    Navigation,
    TippersList
  },
  created() {
    this.$store.dispatch('tippers/update', this.$route.params.broadcaster);
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('tippers/update', to.params.broadcaster);
    next();
  }
}
</script>

<style scoped>
</style>
