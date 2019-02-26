<template>
  <ImagesGrid class="grid" @more="onMore" size="small" />
</template>

<script>
import { mapState } from 'vuex';

import ImagesGrid from '../../components/ImagesGrid';

export default {
  components: {
    ImagesGrid
  },
  computed: {
    ...mapState({
      lastId: state => {
        const data = state.gallery.images.data;

        return data.length ? data[data.length - 1].id : null;
      }
    })
  },
  methods: {
    onMore() {
      this.$store.dispatch('gallery/images/update', { lastId: this.lastId });
    }
  },
  created() {
    this.$store.dispatch('gallery/images/update');
  }
};
</script>

<style scoped>
.grid {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
}
</style>
