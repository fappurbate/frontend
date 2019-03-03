<template>
  <ImagesGrid class="grid" @more="onMore" :size="$route.query.size" />
</template>

<script>
import { mapState } from 'vuex';

import ImagesGrid from '../../components/ImagesGrid';

export default {
  components: {
    ImagesGrid
  },data:()=>({sel:null}),
  computed: {
    ...mapState({
      lastId: state => {
        const data = state.gallery.images.data;

        return data.length ? data[0].id : null;
      }
    })
  },
  watch: {
    async '$route.query.size'(to, from) {
      await this.update({ fresh: true, thumbnails: to });
    }
  },
  methods: {
    async update(options = {}) {
      const { fresh = false, thumbnails = this.$route.query.size } = options;

      await this.$store.dispatch('gallery/images/update', {
        ...!fresh && { lastId: this.lastId },
        thumbnails
      });
    },
    async onMore() {
      await this.update();
    }
  },
  async created() {
    await this.update({ fresh: true });
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
