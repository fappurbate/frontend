<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ extension.name }}</h3>
        <div>{{ extension.description }}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <ExtensionRemoveButton :extension="extension" />
      <ExtensionPowerButton :extension="extension" />
      <v-btn flat :to="`/${broadcaster}/extension/${extension._id}`">
        Details
      </v-btn>
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
  props: ['extension'],
  computed: {
    broadcaster() {
      return this.$route.params.broadcaster;
    }
  }
};
</script>
