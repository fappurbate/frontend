<template>
  <div>
    <LogEntry v-for="entry of logs" :key="entry._id" :entry="entry" />
  </div>
</template>

<script>
import LogEntry from './ExtensionLogEntry';

export default {
  components: {
    LogEntry
  },
  props: {
    logs: Array
  }
};
</script>

<style scoped>
</style>
