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
import Translation from './Translation';

export default {
  props: ['translations'],
  components: {
    Translation
  }
}
</script>

<style scoped>
</style>
