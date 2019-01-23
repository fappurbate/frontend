<template>
  <fragment>
    <Toolbar></Toolbar>

    <v-content>
      <code>{{ $route.params.broadcaster }}</code>
    </v-content>
  </fragment>
</template>

<script>
import Toolbar from '../components/Toolbar';

export default {
  components: {
    Toolbar
  }
}
</script>

<style scoped>
</style>
