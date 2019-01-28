<template>
  <fragment>
    <Navigation />

    <v-content>
      <v-container>
        <TranslationsList :translations="translations"/>
      </v-container>
    </v-content>
  </fragment>
</template>

<script>
import Navigation from '../components/Navigation';
import TranslationsList from '../components/TranslationsList';

export default {
  components: {
    Navigation,
    TranslationsList
  },
  created() {
    this.$store.dispatch('translations/update', this.$route.params.broadcaster);
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('translations/update', to.params.broadcaster);
    next();
  }
}
</script>

<style scoped>
</style>
