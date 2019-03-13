<template>
  <main>
    <Navbar :items="items" />

    <div class="centering-container">
      <div class="duo container">
        <Menu class="is-hidden-mobile" :items="items" />

        <div class="main-content container">
          <slot></slot>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Navbar from './Navbar';
import Menu from './Menu';

export default {
  components: {
    Navbar,
    Menu
  },
  computed: {
    items() {
      return [
        {
          title: 'Dashboard',
          route: 'dashboard',
          path: `/${this.$route.params.broadcaster}`
        },
        {
          title: 'Gallery',
          route: 'gallery',
          path: `/${this.$route.params.broadcaster}/gallery`
        },
        {
          title: 'Tippers',
          route: 'tippers',
          path: `/${this.$route.params.broadcaster}/tippers`
        },
        {
          title: 'Translations',
          route: 'translations',
          path: `/${this.$route.params.broadcaster}/translations`
        },
        {
          title: 'Extensions',
          route: 'extensions',
          path: `/${this.$route.params.broadcaster}/extensions`
        }
      ]
    }
  },
};
</script>

<style lang="scss" scoped>
@import "../../main";

.duo {
  display: flex;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}

.main-content {
  padding: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.centering-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
}

@media (max-width: $widescreen) {
  .container {
    max-width: none;
    width: 100%;
  }
}
</style>
