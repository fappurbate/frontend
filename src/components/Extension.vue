<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ extension.name }}</h3>
        <div>{{ extension.description }}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <v-btn flat>Details</v-btn>
      <v-btn flat @click="onRemove(extension)">Remove</v-btn>

      <ExtensionStopButton v-if="extension.running" :extension="extension" />
      <ExtensionStartButton v-else :extension="extension" />
    </v-card-actions>
  </v-card>
</template>

<script>
import ExtensionStartButton from './ExtensionStartButton';
import ExtensionStopButton from './ExtensionStopButton';

export default {
  components: {
    ExtensionStartButton,
    ExtensionStopButton
  },
  props: ['extension'],
  methods: {
    onRemove(extension) {
      this.$store.dispatch('extensions/remove', { id: extension._id });
    }
  }
};
</script>
