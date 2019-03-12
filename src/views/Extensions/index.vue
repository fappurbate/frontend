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
  watch: {
    '$route.params.broadcaster'(to, from) {
      // this.$store.dispatch('extensionsPage/update', {
      //   broadcaster: to,
      //   page: 1
      // });
    },
    '$route.query.page'(to, from) {
      // this.$store.dispatch('extensionsPage/update', {
      //   broadcaster: this.$route.params.broadcaster,
      //   page: to || 1
      // });
    }
  },
  created() {
    this.$store.dispatch('extensionsPage/update', {
      broadcaster: this.$route.params.broadcaster,
      page: Number(this.$route.query.page) || 1
    });
  }
};
</script>

<style scoped>
</style>
