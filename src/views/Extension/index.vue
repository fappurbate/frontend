<template>
  <fragment>
    <Navigation />

    <v-content>
      <v-tabs v-model="activeTab" centered slider-color="secondary">
        <v-tab v-for="(name, index) of tabs" :key="index">
          {{ name }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="activeTab">
        <v-tab-item v-for="(name, index) of pageNames" :key="index">
          <Page v-if="name in beenOpen" :name="name" />
        </v-tab-item>
        <v-tab-item :key="pageNames.length">
          <Debug v-if="'debug' in beenOpen" />
        </v-tab-item>
      </v-tabs-items>
    </v-content>
  </fragment>
</template>

<script>
import { mapState } from 'vuex';

import Navigation from '../../components/Navigation';
import Debug from './components/Debug';
import Page from './components/Page';
import { capitalized } from '../../common/util';

export default {
  components: {
    Navigation,
    Debug,
    Page
  },
  data: () => ({
    activeTab: 0,
    beenOpen: {}
  }),
  computed: {
    ...mapState({
      loading: state => state.extensionPage.loading,
      extension: state => state.extensionPage.data,
      pages: state => state.extensionPage.data ? state.extensionPage.data.pages || {} : {},
      pageNames(state) {
        return Object.keys(this.pages)
      },
      tabs(state) {
        return [...this.pageNames, 'debug'];
      }
    })
  },
  methods: {
    update(tab) {
      this.$set(this.beenOpen, tab, true);
    }
  },
  watch: {
    async '$route.params.broadcaster'(to, from) {
      this.beenOpen = { [this.tabs[this.activeTab]]: true };
      await this.$store.dispatch('extensionPage/update', {
        id: this.$route.params.extensionId,
        broadcaster: to
      });
    },
    async '$route.params.extensionId'(to, from) {
      this.beenOpen = { [this.tabs[this.activeTab]]: true };
      await this.$store.dispatch('extensionPage/update', {
        id: to,
        broadcaster: this.$route.params.broadcaster
      });
    },
    async activeTab(to, from) {
      this.$router.push(
        {
          name: 'extension',
          params: this.$route.params,
          query: { tab: this.tabs[to] }
        },
        () => this.update(this.tabs[to])
      );
    }
  },
  async created() {
    await this.$store.dispatch('extensionPage/update', {
      id: this.$route.params.extensionId,
      broadcaster: this.$route.params.broadcaster
    });

    if (!this.$route.query.tab) {
      this.$router.replace({
        name: 'extension',
        params: this.$route.params,
        query: {
          tab: this.tabs[0]
        }
      });
    }

    this.activeTab = this.tabs.indexOf(this.$route.query.tab);
    this.update(this.$route.query.tab);
  }
};
</script>

<style scoped>
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  bottom: 0;
}
</style>
