<template>
  <div class="translations-container">
    <div class="data-container">
      <Translation class="translation"
        v-for="translation of translations"
        :key="`${translation.tabId}::${translation.msgId}`"
        :content="translation.content"
        :tabId="translation.tabId"
        :msgId="translation.msgId" />
    </div>
    <button class="load-more button is-text is-rounded" @click="$emit('more')">
      More
    </button>
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

.load-more {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -150%);

  transition: opacity $color-change-duration;
  opacity: 0.5;
}

.load-more:hover {
  opacity: 1;
}

.load-more:focus {
  border: 0;
  box-shadow: none;
}

.translation:not(:last-child) {
  margin-bottom: 1rem;
}
</style>
