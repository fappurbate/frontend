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
  watch: {
    '$route.params.broadcaster'(to, from) {
      this.$store.dispatch('translationsPage/update', {
        broadcaster: to,
        page: 1
      });
    },
    '$route.query.page'(to, from) {
      this.$store.dispatch('translationsPage/update', {
        broadcaster: this.$route.params.broadcaster,
        page: to
      });
    }
  },
  created() {
    this.$store.dispatch('translationsPage/update', {
      broadcaster: this.$route.params.broadcaster,
      page: Number(this.$route.query.page) || 1
    });
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
