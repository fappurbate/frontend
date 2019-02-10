<template>
  <Layout>
    <TranslationsList class="translations-list" />
  </Layout>
</template>

<script>
import Layout from '../components/Layout';
import TranslationsList from '../components/TranslationsList';

export default {
  components: {
    Layout,
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
.translations-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin: 1.5rem;
}
</style>
