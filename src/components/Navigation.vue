<template>
  <fragment>
    <v-toolbar app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Kothique Chaturbate Kit</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-navigation-drawer class="elevation-8"
        v-model="drawer" enable-resize-watcher floating app clipped>
      <v-list class="pt-0">
        <v-list-tile ripple :disabled="item.disabled"
            @click="$router.push(item.path)"
            v-for="item of items" :key="item.name">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    drawer: null
  }),
  computed: {
    items() {
      return [
        {
          name: 'Tippers',
          path: `/${this.broadcaster}/tippers`,
          icon: 'money'
        },
        {
          name: 'Translations',
          path: `/${this.broadcaster}/translations`,
          icon: 'translate'
        },
        {
          name: 'Animation',
          path: `/${this.broadcaster}/animation`,
          icon: 'movie',
          disabled: true
        }
      ];
    },
    ...mapState({
      broadcaster() {
        return this.$route.params.broadcaster;
      }
    })
  }
}
</script>

<style scoped>
</style>
