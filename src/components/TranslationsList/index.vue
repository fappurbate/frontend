<template>
  <div class="translations-container">
    <div class="data-container">
      <Translation class="translation"
        v-for="translation of data.items"
        :key="`${translation.tabId}::${translation.msgId}`"
        :content="translation.content"
        :tabId="translation.tabId"
        :msgId="translation.msgId" />
    </div>
    <MoreButton @more="$emit('more')" :disabled="data.all" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Translation from './Translation';
import MoreButton from '../MoreButton';

export default {
  components: {
    Translation,
    MoreButton
  },
  computed: {
    ...mapState({
      data: state => state.translationsPage.data
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../../main";

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

.translation:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
