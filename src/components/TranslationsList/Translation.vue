<template>
  <b-collapse class="card" :open="false" @open="$refs.translation.focus()">
    <div slot="trigger" slot-scope="props" class="card-header">
      <p class="card-header-title">
        {{ content }}
      </p>
      <a class="card-header-icon">
        <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"></b-icon>
      </a>
    </div>
    <div class="card-content">
      <b-field class="translation">
        <b-input type="textarea" ref="translation"
          v-model="translation" @keyup.native.ctrl.enter="onReply"></b-input>
      </b-field>
      <div class="controls">
        <button class="button is-dark is-rounded" @click="onReply">
          Send
        </button>
      </div>
    </div>
  </b-collapse>
</template>

<script>
import * as WS from '../../common/ws';

export default {
  props: ['broadcaster', 'content', 'tabId', 'msgId'],
  data: () => ({
    translation: ''
  }),
  methods: {
    onReply() {
      if (!this.translation) { return; }

      this.$store.dispatch('translationsPage/translate', {
        tabId: this.tabId,
        msgId: this.msgId,
        translation: this.translation.trim()
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../main";

.card-header-title {
  font-weight: normal;
}

.card-content {
  display: flex;
  align-items: stretch;
}

.translation {
  margin-bottom: 0;
  flex-grow: 5;
}

.controls {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-evenly;

  padding-left: 1.5rem;
}

@media (max-width: $tablet) {
  .card-content {
    flex-direction: column;
  }

  .controls {
    padding-left: 0;
  }
}
</style>
