<template>
  <Layout>
    <b-tabs class="details" v-model="activeTab" type="is-toggle-rounded" position="is-centered">
      <b-tab-item class="tab-item" label="Images" key="images">
        <Images v-if="beenOpen.images" />
      </b-tab-item>

      <b-tab-item class="tab-item" label="Audio" key="audio">
        <Audio v-if="beenOpen.audio" />
      </b-tab-item>
    </b-tabs>
  </Layout>
</template>

<script>
import { mapState } from 'vuex';

import Layout from '../../components/Layout';
import Images from './Images';
import Audio from './Audio';

export default {
  components: {
    Layout,
    Images,
    Audio
  },
  data: () => ({
    activeTab: 0,
    tabs: ['images', 'audio'],
    beenOpen: {}
  }),
  methods: {
    update(tab) {
      this.$set(this.beenOpen, tab, true);
    }
  },
  watch: {
    async activeTab(to, from) {
      this.$router.push(
        {
          name: 'gallery',
          params: this.$route.params,
          query: { tab: this.tabs[to] }
        },
        () => this.update(this.tabs[to])
      );
    }
  },
  async created() {
    if (!this.$route.query.tab) {
      this.$router.replace({
        name: 'gallery',
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
