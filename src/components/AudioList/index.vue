<template>
  <div class="list-container">
    <div class="audio-list">
      <template v-for="audio of data.items">
        <AudioPlayer :audio="audio" :select="select" :multiple="multiple"
          :value="value" @input="$emit('input', $event)"
          class="player" />
      </template>
    </div>

    <MoreButton @more="$emit('more')" :disabled="data.all" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AudioPlayer from './AudioPlayer';
import MoreButton from '../MoreButton';

export default {
  components: {
    AudioPlayer,
    MoreButton
  },
  props: {
    select: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    value: { validator: () => true }
  },
  computed: {
    ...mapState({
      data: state => state.gallery.audio.data
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

.list-container {
  max-width: 1400px;

  padding: 1rem;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
}

.audio-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  overflow-y: auto;
  padding: 1rem;

  padding-bottom: calc(1.5rem + 36px);
}

.player:not(:last-child) {
  margin-bottom: 0.5rem;
}
</style>
