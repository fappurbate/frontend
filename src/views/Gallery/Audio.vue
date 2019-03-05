<template>
  <AudioList class="audio-list" @more="onMore" />
</template>

<script>
import { mapState } from 'vuex';

import AudioList from '../../components/AudioList';

export default {
  components: {
    AudioList
  },
  computed: {
    ...mapState({
      lastId: state => {
        const data = state.gallery.audio.data;

        return data.length ? data[0].id : null;
      }
    })
  },
  watch: {
    async '$route.query.size'(to, from) {
      await this.update({ fresh: true });
    }
  },
  methods: {
    async update(options = {}) {
      const { fresh = false } = options;

      await this.$store.dispatch('gallery/audio/update', {
        ...!fresh && { lastId: this.lastId }
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
.audio-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
</style>
