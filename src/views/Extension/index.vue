<template>
  <Layout>
    <b-tabs class="details" v-model="activeTab" type="is-toggle-rounded" position="is-centered">
      <template v-for="name, index in pageNames">
        <b-tab-item class="tab-item" :label="capitalize(name)" :key="index">
          <Page :name="name" :key="index" v-if="name in beenOpen" />
        </b-tab-item>
      </template>

      <b-tab-item label="Debug" :key="tabs.length - 1">
        <Debug v-if="'debug' in beenOpen" />
      </b-tab-item>
  </b-tabs>

  </Layout>
</template>

<script>
import { mapState } from 'vuex';

import Layout from '../../components/Layout';
import Debug from './components/Debug';
import Page from './components/Page';
import { capitalized } from '../../common/util';

export default {
  components: {
    Layout,
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
    },
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.substr(1);
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
  },
  mounted() {
    document.querySelector('.b-tabs.details > .tab-content')
      .style['flex-grow'] = '1';
  }
};
</script>

<style scoped>
.details {
  margin: 1.5rem;

  flex-grow: 1;

  display: flex;
  flex-direction: column;
}

.tab-item {
  height: 100%;
}

.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  bottom: 0;
}
</style>
