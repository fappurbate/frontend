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
  watch: {
    '$route.params.broadcaster'(to, from) {
      this.$store.dispatch('tippersPage/update', {
        broadcaster: to,
        page: 1
      });
    },
    '$route.query.page'(to, from) {
      this.$store.dispatch('tippersPage/update', {
        broadcaster: this.$route.params.broadcaster,
        page: to
      });
    }
  },
  created() {
    this.$store.dispatch('tippersPage/update', {
      broadcaster: this.$route.params.broadcaster,
      page: Number(this.$route.query.page || 1)
    });
  }
}
</script>

<style scoped>
.tippers-list {
  margin: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
}
</style>
