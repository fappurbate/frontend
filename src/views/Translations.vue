<template>
  <Layout>
    <TranslationsList class="translations-list" @more="onMore" />
  </Layout>
</template>

<script>
import { mapGetters } from 'vuex';

import Layout from '../components/Layout';
import TranslationsList from '../components/TranslationsList';

export default {
  components: {
    Layout,
    TranslationsList
  },
  computed: {
    ...mapGetters({
      lastId: 'translationsPage/lastId'
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

      await this.$store.dispatch('translationsPage/update', {
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
.translations-list {
  display: flex;
  flex-direction: column;
  align-items: stretch;

  margin: 1.5rem;
}
</style>
