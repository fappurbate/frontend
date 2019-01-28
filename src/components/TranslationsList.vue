<template>
  <v-expansion-panel popout>
    <Translation v-for="translation of translations"
      :key="`${translation.tabId}::${translation.msgId}`"
      :content="translation.content"
      :tabId="translation.tabId"
      :msgId="translation.msgId" />
  </v-expansion-panel>
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
</style>
