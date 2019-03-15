<template>
  <Layout>
    <TippersList class="tippers-list" @more="onMore" />
  </Layout>
</template>

<script>
import { mapGetters } from 'vuex';

import Layout from '../components/Layout';
import TippersList from '../components/TippersList';

export default {
  components: {
    Layout,
    TippersList
  },
  computed: {
    ...mapGetters({
      lastId: 'tippersPage/lastId'
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

      await this.$store.dispatch('tippersPage/update', {
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
