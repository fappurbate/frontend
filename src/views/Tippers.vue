<template>
  <Layout>
    <TippersList class="tippers-list" />
  </Layout>
</template>

<script>
import Layout from '../components/Layout';
import TippersList from '../components/TippersList';

export default {
  components: {
    Layout,
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
.tippers-list {
  margin: 1.5rem;
}
</style>
