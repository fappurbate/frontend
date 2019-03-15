<template>
  <div class="list-container">
    <div class="audio-list">
      <template v-for="audio of data.items">
        <AudioPlayer :audio="audio" :select="select" :multiple="multiple"
          :value="value" @input="$emit('input', $event)"
          class="player" />
      </template>
    </div>

    <button class="load-more button is-text is-rounded" @click="$emit('more')"
        :disabled="data.all">
      More
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AudioPlayer from './AudioPlayer';

export default {
  components: {
    AudioPlayer
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

.player:not(:last-child) {
  margin-bottom: 0.5rem;
}
</style>
