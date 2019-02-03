<template>
  <fragment>
    <v-toolbar app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Kothique Chaturbate Kit</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-menu offset-y>
          <v-btn flat slot="activator">
            {{ broadcaster }}
          </v-btn>
          <v-list>
            <v-list-tile
                v-for="broadcaster of broadcasters"
                :key="broadcaster.username"
                @click="onChangeBroadcaster(broadcaster.username)">
              <v-list-tile-title>{{ broadcaster.username }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <v-btn icon @click="$router.push({ name: 'start' })">
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer class="elevation-8"
        v-model="drawer" floating app clipped>
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
          <v-list-tile-action v-if="item.onUpdate">
            <v-btn fab small flat @click="item.onUpdate">
              <v-icon>refresh</v-icon>
            </v-btn>
          </v-list-tile-action>
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
          icon: 'attach_money',
          onUpdate: () => {
            this.$store.dispatch('tippers/update', this.broadcaster);
          }
        },
        {
          name: 'Translations',
          path: `/${this.broadcaster}/translations`,
          icon: 'translate',
          onUpdate: () => {
            this.$store.dispatch('translations/update', this.broadcaster);
          }
        },
        {
          name: 'Animation',
          path: `/${this.broadcaster}/animation`,
          icon: 'movie'
        },
        {
          name: 'Extensions',
          path: `/${this.broadcaster}/extensions`,
          icon: 'extension',
          onUpdate: () => {
            this.$store.dispatch('extensionsList/update', this.broadcaster);
          }
        }
      ];
    },
    broadcaster() {
      return this.$route.params.broadcaster;
    },
    ...mapState({
      broadcasters: state => state.broadcasters.data
    })
  },
  methods: {
    onChangeBroadcaster(broadcaster) {
      const name = this.$route.matched[0].name;
      this.$router.push({ name, params: { broadcaster }});
    }
  }
}
</script>

<style scoped>
</style>
