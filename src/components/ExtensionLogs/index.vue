<template>
  <div>
    <Entry v-for="entry of logs" :key="entry._id" :entry="entry" />
  </div>
</template>

<script>
import Entry from './Entry';

export default {
  components: {
    Entry
  },
  props: {
    logs: Array
  }
};
</script>

<style scoped>
</style>
