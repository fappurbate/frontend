<template>
  <div>
    <div id="label" class="subheading">Choose broadcaster:</div>
    <v-autocomplete
      v-model="broadcaster"
      :items="items"
      @change="onChange" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data: () => ({
    broadcaster: ''
  }),
  computed: {
    items() {
      return this.broadcasters.map(b => b.username);
    },
    ...mapState({
      broadcasters: state => state.broadcasters.data
    })
  },
  methods: {
    onChange(broadcaster) {
      this.$router.push({ name: 'dashboard', params: { broadcaster }});
    },
    ...mapActions({
      update: 'broadcasters/update'
    })
  }
}
</script>

<style scoped>
#label {
  text-align: center;
}
</style>
