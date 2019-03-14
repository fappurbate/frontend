<template>
  <Layout>
    <b-tabs type="is-toggle-rounded" position="is-centered" v-model="activeTab"
        class="gallery-tabs">
      <div slot="controls-left" class="controls-container">
        <UploadButton />
      </div>

      <b-tab-item label="Images" class="tab-item">
        <Images v-if="beenOpen.images" />
      </b-tab-item>

      <b-tab-item label="Audio" class="tab-item">
        <Audio v-if="beenOpen.audio" />
      </b-tab-item>

      <div slot="controls-right" v-if="activeTab === 0" class="controls-container">
        <b-field class="image-size-switcher is-hidden-mobile">
          <b-radio-button v-model="imageSize"
            native-value="small"
            type="is-secondary">
            <b-icon class="image-size-icon" icon="image-size-select-small"></b-icon>
          </b-radio-button>

          <b-radio-button v-model="imageSize"
              native-value="medium"
              type="is-secondary">
            <b-icon class="image-size-icon" icon="image-size-select-large"></b-icon>
          </b-radio-button>

          <b-radio-button v-model="imageSize"
            native-value="large"
            type="is-secondary">
            <b-icon class="image-size-icon" icon="image-size-select-actual"></b-icon>
          </b-radio-button>
        </b-field>

        <b-dropdown v-model="imageSize" class="is-hidden-tablet">
          <button class="button is-secondary" type="button" slot="trigger">
            <template v-for="{ name, icon } of imageSizes">
              <b-icon  v-if="imageSize === name" :icon="icon" :key="name"></b-icon>
            </template>
          </button>

          <b-dropdown-item :value="name" v-for="{ name, title, icon } of imageSizes"
              :key="name">
            <b-icon :icon="icon"></b-icon>
            <h3>{{ title }}</h3>
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </b-tabs>
  </Layout>
</template>

<script>
import { mapState } from 'vuex';

import Layout from '../../components/Layout';
import Images from './Images';
import Audio from './Audio';
import UploadButton from './components/UploadButton';

export default {
  components: {
    Layout,
    Images,
    Audio,
    UploadButton
  },
  data: () => ({
    beenOpen: {},
    activeTab: null,
    imageSize: null,

    tabs: ['images', 'audio'],
    imageSizes: [
      {
        name: 'small',
        title: 'Small',
        icon: 'image-size-select-small'
      },
      {
        name: 'medium',
        title: 'Medium',
        icon: 'image-size-select-large'
      },
      {
        name: 'large',
        title: 'Large',
        icon: 'image-size-select-actual'
      }
    ]
  }),
  computed: {
    ...mapState({
      thumbnails: state => state.gallery.images.thumbnails
    })
  },
  watch: {
    imageSize(to, from) {
      this.$router.replace({
        name: 'gallery',
        params: this.$route.params,
        query: {
          tab: 'images',
          size: to
        }
      }, () => this.update('images'));
    },
    activeTab(tabId, previousTabId) {
      if (previousTabId === null) { return; }

      const tab = this.tabs[tabId];

      this.activeTab = tabId;
      if (tab === 'images') {
        this.imageSize = this.imageSize || this.thumbnails;
      }

      this.$router.push({
        name: 'gallery',
        params: this.$route.params,
        query: {
          tab,
          ...tab === 'images' && { size: this.imageSize }
        }
      }, () => this.update(tab));
    }
  },
  methods: {
    update(tab) {
      this.$set(this.beenOpen, tab, true);
    }
  },
  async created() {
    const tab = this.$route.query.tab || 'images';

    const query = {
      tab,
      ...tab === 'images' && { size: this.$route.query.size || this.thumbnails }
    };
    let updateQuery = false;

    if (!this.$route.query.tab) {
      updateQuery = true;
    }

    if (query.tab === 'images' && !this.$route.query.size) {
      updateQuery = true;
    }

    if (updateQuery) {
      this.$router.replace({
        name: 'gallery',
        params: this.$route.params,
        query
      });
    }

    this.activeTab = this.tabs.indexOf(tab);
    if (query.size) {
      this.imageSize = query.size;
    }
    this.update(tab);
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

.gallery-tabs {
  flex-grow: 1;
  padding: 1.5rem;
  padding-bottom: 0;
}

.controls-container {
  display: flex;
  align-items: center;
  height: 100%;
}

.image-size-icon {
  margin: 0 auto !important;
}

.image-size-switcher {
  margin-bottom: 0 !important;
}
</style>
