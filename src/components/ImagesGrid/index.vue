<template>
  <div class="grid-container">
    <div class="images-grid" :style=
        "{
          'grid-template-columns': `repeat(auto-fill, calc(0.5rem + ${imageSize}px))`
        }">
      <template v-for="image of data">
        <Thumbnail :image="image" @preview="onPreview(image)"
          :select="select" :multiple="multiple"
          :value="value" @input="$emit('input', $event)" />
      </template>
    </div>
    <button class="load-more button is-text is-rounded" @click="$emit('more')">
      More
    </button>

    <b-modal :active.sync="showPreview">
      <img class="preview" :src="`/api/gallery/${previewFileId}/preview`"
        @click="showPreview = false"/>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Thumbnail from './Thumbnail';

export default {
  components: {
    Thumbnail
  },
  props: {
    select: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    size: {
      type: String,
      validator: value => ['small', 'medium', 'large'].includes(value)
    },
    value: { validator: () => true }
  },
  data: () => ({
    previewFileId: null,
    showPreview: false
  }),
  methods: {
    onPreview(image) {
      this.previewFileId = image.id;
      this.showPreview = true;
    }
  },
  computed: {
    ...mapState({
      data: state => state.gallery.images.data
    }),
    imageSize() {
      if (this.size === 'small') {
        return 128;
      } else if (this.size === 'medium') {
        return 172;
      } else if (this.size === 'large') {
        return 256;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

.grid-container {
  max-width: 1400px;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
}

.images-grid {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: grid;
  grid-gap: 1rem;
  justify-content: center;
  align-items: flex-start;

  overflow-y: auto;
  padding: 1rem;

  padding-bottom: calc(1.5rem + 36px);
}

.preview {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: zoom-out;
}

.load-more {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -150%);

  transition: opacity $color-change-duration;
  opacity: 0.5;
}

.load-more:hover {
  opacity: 1;
}

.load-more:focus {
  border: 0;
  box-shadow: none;
}
</style>
