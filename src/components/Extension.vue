<template>
  <v-card>
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ extension.name }}</h3>
        <div>{{ extension.description }}</div>
      </div>
    </v-card-title>
    <v-card-text>
    </v-card-text>
    <v-card-actions>
      <v-btn flat>Details</v-btn>
      <v-btn flat @click="onRemove(extension)">Remove</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: ['extension'],
  methods: {
    onRemove(extension) {
      this.$store.dispatch('extensions/remove', extension._id);
    }
  }
};
</script>
