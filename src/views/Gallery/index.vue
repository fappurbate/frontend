<template>
  <Layout>
    <div class="tabs is-toggle is-centered is-toggle-rounded">
      <ul>
        <li :class="{ 'is-active': activeTab === 'images' }" @click="onTabClick('images')">
          <a>Images</a>
        </li>
        <li :class="{ 'is-active': activeTab === 'audio' }" @click="onTabClick('audio')">
          <a>Audio</a>
        </li>
      </ul>
    </div>

    <div class="content">
      <Images v-if="beenOpen.images" v-show="activeTab === 'images'" />
      <Audio v-if="beenOpen.audio" v-show="activeTab === 'audio'" />
    </div>
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
    activeTab: null,
    beenOpen: {}
  }),
  methods: {
    update(tab) {
      this.$set(this.beenOpen, tab, true);
    },
    onTabClick(tab) {
      if (tab !== this.activeTab) {
        this.activeTab = tab;
        this.$router.push({
          name: 'gallery',
          params: this.$route.params,
          query: { tab }
        }, () => this.update(tab));
      }
    }
  },
  async created() {
    if (!this.$route.query.tab) {
      this.$router.replace({
        name: 'gallery',
        params: this.$route.params,
        query: {
          tab: 'images'
        }
      });
    }

    this.activeTab = this.$route.query.tab;
    this.update(this.$route.query.tab);
  }
};
</script>

<style scoped>
.tabs {
  margin: 1.5rem;
}

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
  position: relative;
  flex-grow: 1;
}
</style>
