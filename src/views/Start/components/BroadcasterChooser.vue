<template>
  <b-dropdown hoverable>
    <button class="button is-primary" type="button" slot="trigger">
      <span>Choose broadcaster</span>
      <b-icon icon="menu-down"></b-icon>
    </button>

    <b-dropdown-item v-for="username in items" :key="username"
        @click="onChoose(username)" class="item">
      {{ username }}
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';

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
    onChoose(broadcaster) {
      this.$router.push({ name: 'dashboard', params: { broadcaster }});
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../main";

.item {
  transition: color 200ms;
}

.item:hover {
  color: $secondary !important;
  background: transparent !important;
}
</style>
