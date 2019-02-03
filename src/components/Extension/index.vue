<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ extension.name }}</h3>
        <div>{{ extension.description }}</div>
      </div>
    </v-card-title>
    <v-card-actions>
      <RemoveButton :extension="extension" />
      <PowerButton :extension="extension" />
      <v-btn flat :to="`/${broadcaster}/extension/${extension._id}`">
        Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import PowerButton from './PowerButton';
import RemoveButton from './RemoveButton';

export default {
  components: {
    PowerButton,
    RemoveButton
  },
  props: ['extension'],
  computed: {
    broadcaster() {
      return this.$route.params.broadcaster;
    }
  }
};
</script>
