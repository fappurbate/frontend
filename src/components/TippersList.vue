<template>
  <v-list>
    <template v-for="(tipper, index) of tippers">
      <v-divider v-if="index > 0" :key="index" />
      <v-list-tile :key="tipper.username">
        <v-list-tile-content>
          <v-list-tile-title>
            {{ tipper.username }}
            <span class="amount">{{ tipper.amount }}</span>
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
import { mapState } from 'vuex';

export default {
  created() {
    this.$store.dispatch('tippers/update', this.$route.params.broadcaster);
  },
  computed: {
    ...mapState({
      tippers: state => state.tippers.data
    })
  }
}
</script>

<style scoped>
.amount {
  float: right;
}
</style>
