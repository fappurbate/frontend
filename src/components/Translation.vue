<template>
  <v-expansion-panel-content class="elevation-2 mb-2">
    <v-icon v-if="translation" slot="actions">warning</v-icon>
    <div class="py-1" slot="header">{{ content }}</div>
    <v-card>
      <v-card-text class="reply-form pl-4 pr-4 pb-4 pt-0">
        <v-textarea auto-grow clearable counter="256" color="secondary"
          v-model="translation" @keyup.ctrl.enter="onReply">
        </v-textarea>
        <div class="controls pb-3 pl-3">
          <v-btn class="elevation-2"  @click="onReply"
              icon :outline="!translation" fab :disabled="!translation">
            <v-icon>reply</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-expansion-panel-content>
</template>

<script>
import * as WS from '../common/ws';

export default {
  props: ['broadcaster', 'content', 'tabId', 'msgId'],
  data: () => ({
    translation: ''
  }),
  methods: {
    onReply() {
      this.$store.dispatch('translations/translate', {
        tabId: this.tabId,
        msgId: this.msgId,
        translation: this.translation.trim()
      });
    }
  }
}
</script>

<style scoped>
.reply-form {
  display: flex;
  align-items: center;
}

.controls {
  /* padding-bottom: 20px; */
}
</style>
