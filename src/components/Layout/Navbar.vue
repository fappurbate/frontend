<template>
  <nav class="navbar is-primary" role="navigation">
    <div class="container">
      <div class="navbar-brand">
        <div class="navbar-item">
          <!-- <img src="/logo.png" class="navbar-logo" /> -->
          <a class="navbar-logo" @click="$router.push('/')"></a>
        </div>
        <div class="navbar-item is-size-5">
          Fappurbate
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item has-dropdown is-hoverable is-bordered is-hidden-tablet">
          <a class="navbar-link is-arrowless is-size-5">
            {{ $route.name }}
          </a>

          <div class="navbar-dropdown is-right is-boxed">
            <a class="navbar-item" @click="$router.push(item.path)"
                v-for="item in items" :key="item.route"
                :class="{ 'is-active': $route.name === item.route }">
              {{ item.title }}
            </a>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable is-bordered">
          <a class="navbar-link is-arrowless is-size-5">
            {{ $route.params.broadcaster }}
          </a>

          <div class="navbar-dropdown is-right is-boxed">
            <a class="navbar-item" @click="onChangeBroadcaster(broadcaster.username)"
                v-for="broadcaster in allBroadcasters" :key="broadcaster.username"
                :class="{ 'is-active': broadcaster.username === $route.params.broadcaster }">
              {{ broadcaster.username }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    items: Array
  },
  computed: {
    ...mapState({
      allBroadcasters: state => state.broadcasters.data
    })
  },
  methods: {
    onChangeBroadcaster(broadcaster) {
      const name = this.$route.matched[0].name;
      this.$router.push({ name, params: { ...this.$route.params, broadcaster } });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

.navbar-brand {
  margin-left: 0 !important;
}

.navbar-brand > a.navbar-item:hover {
  background-color: initial !important;
}

.navbar-brand > div.navbar-item {
  cursor: default;
}

.navbar-logo {
  border-radius: 2px;
  height: 3.2rem;
  width: 3.2rem;
  max-height: none;
  background-color: $secondary;
}

.navbar-link, .navbar-brand > .navbar-item {
  background-color: transparent !important;
  transition: color 200ms;
}

.navbar-link:hover, .navbar-brand > .navbar-item:hover {
  color: $secondary !important;
  cursor: default;
}

.navbar-dropdown > .navbar-item.is-active {
  cursor: default;
}

@media (max-width: $widescreen) {
  .container {
    max-width: none;
    width: 100%;
  }
}
</style>
