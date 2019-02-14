<template>
  <div class="translations-container">
    <div class="data-container">
      <Translation class="translation"
        v-for="translation of translations.rows"
        :key="`${translation.tabId}::${translation.msgId}`"
        :content="translation.content"
        :tabId="translation.tabId"
        :msgId="translation.msgId" />
    </div>
    <b-pagination
      v-if="translations"
      class="pagination"
      per-page="20"
      order="is-centered"
      :total="translations.total"
      :current="translations.page"
      @change="value => $router.push(`/${$route.params.broadcaster}/translations?page=${value}`)">
    </b-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Translation from './Translation';

export default {
  components: {
    Translation
  },
  computed: {
    ...mapState({
      translations: state => state.translationsPage.data
    })
  }
}
</script>

<style scoped>
.translations-container {
  overflow: hidden;
  margin: 1.5rem;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
}

.data-container {
  padding: 0.5rem;
  overflow-y: auto;
}

.pagination {
  height: 48px;
  min-height: 48px;
  margin-top: 0.5rem;
}

.translation:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
