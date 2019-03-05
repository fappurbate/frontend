<template>
  <Layout>
    <div class="tabs is-toggle is-centered is-toggle-rounded">
      <UploadButton />

      <ul class="tabs-container">
        <li :class="{ 'is-active': activeTab === 'images' }" @click="onTabClick('images')">
          <a>Images</a>
        </li>
        <li :class="{ 'is-active': activeTab === 'audio' }" @click="onTabClick('audio')">
          <a>Audio</a>
        </li>
      </ul>

      <b-field v-if="activeTab === 'images'" class="image-size-switcher is-hidden-mobile">
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

      <b-dropdown v-if="activeTab === 'images'" v-model="imageSize" class="is-hidden-tablet">
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
    }
  },
  methods: {
    update(tab) {
      this.$set(this.beenOpen, tab, true);
    },
    onTabClick(tab) {
      if (tab !== this.activeTab) {
        this.activeTab = tab;
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

    this.activeTab = query.tab;
    if (query.size) {
      this.imageSize = query.size;
    }
    this.update(this.$route.query.tab);
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

.tabs {
  padding: 1.5rem;
  margin: 0;
  margin-bottom: 0 !important;

  display: flex;
  align-items: center;

  position: relative;
}

.tabs-container {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  transform: translateX(-50%);
}

.tab-item {
  height: 100%;
}

.content {
  position: relative;
  flex-grow: 1;
}

.image-size-icon {
  margin: 0 auto !important;
}

.image-size-switcher {
  margin-bottom: 0 !important;
}
</style>
