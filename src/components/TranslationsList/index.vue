<template>
  <div>
    <Translation class="translation"
      v-for="translation of translations.rows"
      :key="`${translation.tabId}::${translation.msgId}`"
      :content="translation.content"
      :tabId="translation.tabId"
      :msgId="translation.msgId" />
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
      translations: state => state.translations.data
    })
  }
}
</script>

<style scoped>
.translation {
  margin-bottom: 1rem;
}
</style>
