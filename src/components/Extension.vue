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
      <ExtensionRemoveButton :extension="extension" />
      <ExtensionPowerButton :extension="extension" />
    </v-card-actions>
  </v-card>
</template>

<script>
import ExtensionPowerButton from './ExtensionPowerButton';
import ExtensionRemoveButton from './ExtensionRemoveButton';

export default {
  components: {
    ExtensionPowerButton,
    ExtensionRemoveButton
  },
  props: ['extension']
};
</script>
