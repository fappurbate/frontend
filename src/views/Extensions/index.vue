<template>
  <Layout>
    <Toolbar />
    <Grid />
  </Layout>
</template>

<script>
import Layout from '../../components/Layout';
import Toolbar from './components/Toolbar';
import Grid from './components/Grid';

export default {
  components: {
    Layout,
    Toolbar,
    Grid
  },
  created() {
    this.$store.dispatch('extensionsPage/update', this.$route.params.broadcaster);
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch('extensionsPage/update', to.params.broadcaster);
    next();
  }
};
</script>

<style scoped>
</style>
