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
  }
}
</script>

<style scoped>
</style>
