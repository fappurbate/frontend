<template>
  <Layout>
    <Toolbar />
    <Grid @more="onMore" />
  </Layout>
</template>

<script>
import { mapGetters } from 'vuex';

import Layout from '../../components/Layout';
import Toolbar from './components/Toolbar';
import Grid from './components/Grid';

export default {
  components: {
    Layout,
    Toolbar,
    Grid
  },
  computed: {
    ...mapGetters({
      lastId: 'extensionsPage/lastId'
    })
  },
  watch: {
    '$route.params.broadcaster'(broadcaster) {
      this.update({ broadcaster, fresh: true });
    }
  },
  methods: {
    async update(options = {}) {
      const { broadcaster, fresh = false } = options;

      await this.$store.dispatch('extensionsPage/update', {
        broadcaster: broadcaster || this.$route.params.broadcaster,
        ...!fresh && { lastId: this.lastId }
      });
    },
    async onMore() {
      await this.update();
    }
  },
  async created() {
    await this.update({ fresh: true });
  }
};
</script>

<style scoped>
</style>
