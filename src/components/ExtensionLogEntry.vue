<template>
  <div :class="{ entry: true, [`entry-${entry.level}`]: true }">
    <span class="timestamp">
      {{ entry.timestamp }}:
    </span>
    <span>
      {{ entry.message }}
    </span>
    <span v-if="showMeta">{{ entry.meta }}</span>
  </div>
</template>

<script>
export default {
  props: {
    entry: Object
  },
  computed: {
    showMeta() {
      return Object.keys(this.entry.meta || {}).length > 0;
    }
  }
};
</script>

<style scoped>
.entry {
  padding: 0.5rem 1rem;
  font-family: monospace;
}

.entry-error {
  background-color: #ef9a9a;
}

.entry-warn {
  background-color: #ffe082;
}

.entry-info {
  background-color: white;
}

.entry-verbose {
  background-color: #b0bec5;
}

.entry-debug {
  background-color: #bcaaa4;
}

.entry-silly {
  background-color: #e6ee9c;
}

.timestamp {
  font-weight: bold;
}
</style>
