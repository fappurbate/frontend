<template>
  <div class="card">
    <div class="card-content">
      <audio ref="audio" :src="`/api/gallery/${audio.id}`" />

      <button class="play-pause-button button is-rounded" :disabled="!canplay"
          :class="{ 'is-loading': !canplay || waiting, 'is-light': !canplay || waiting }"
          @click="onPlayPause">
        <b-icon v-if="paused" icon="play"></b-icon>
        <b-icon v-else icon="pause"></b-icon>
      </button>

      <button class="stop-button button is-rounded is-small" :disabled="!canplay"
          @click="onStop">
        <b-icon icon="stop" size="is-small"></b-icon>
      </button>

      <div class="middle-group">
        <div class="text-data">
          <span class="filename"><small>{{ audio.filename }}</small></span>
          <span class="time"><small>{{ time }}</small></span>
        </div>

        <Timeline class="player-timeline" :currentTime="currentTime" :duration="duration"
          :buffered="buffered" :disabled="!canplay" :clickable="false" />
      </div>

      <div class="controls">
        <template v-if="!select">
          <b-dropdown v-for="mobile of [true, false]" :key="mobile" :hoverable="!mobile"
              :class="{
                'is-hidden-mobile': !mobile,
                'is-hidden-tablet': mobile
              }"
              position="is-bottom-left">
            <b-icon slot="trigger" class="menu-icon" icon="dots-vertical" size="is-small" />

            <b-dropdown-item class="item item-remove" size="is-small" @click="onRemove">
              <b-icon class="dropdown-icon" icon="trash-can" size="is-small"></b-icon>
              <span>Remove</span>
            </b-dropdown-item>
          </b-dropdown>
        </template>

        <b-radio v-else-if="select && !multiple" class="radio"
          size="is-small" type="is-secondary" :native-value="audio.id"
          :value="value" @input="$emit('input', $event)">
        </b-radio>

        <b-checkbox v-else-if="select && multiple" class="checkbox"
          size="is-small" type="is-secondary" :native-value="audio.id"
          :value="value" @input="$emit('input', $event)">
        </b-checkbox>
      </div>
    </div>
  </div>
</template>

<script>
import Timeline from './Timeline';

export default {
  components: {
    Timeline
  },
  props: {
    audio: Object,
    select: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    value: { validator: () => true }
  },
  data: () => ({
    paused: true,
    duration: 0,
    currentTime: 0,
    canplay: false,
    waiting: false,
    buffered: null
  }),
  mounted() {
    this.buffered = this.$refs.audio.buffered;

    this.$refs.audio.addEventListener('canplay', () => this.canplay = true);
    this.$refs.audio.addEventListener('play', () => this.paused = false);
    this.$refs.audio.addEventListener('pause', () => this.paused = true);
    this.$refs.audio.addEventListener('timeupdate', () => this.currentTime = this.$refs.audio.currentTime);
    this.$refs.audio.addEventListener('loadedmetadata', () => this.duration = this.$refs.audio.duration);
    this.$refs.audio.addEventListener('durationchange', () => this.duration = this.$refs.audio.duration);
    this.$refs.audio.addEventListener('error', () => {
      this.$dialog.alert({
        title: 'Error',
        message: `Failed to play audio: ${this.$refs.audio.error.message}`,
        type: 'is-danger'
      });
    });
    this.$refs.audio.addEventListener('waiting', () => this.waiting = true);
    this.$refs.audio.addEventListener('canplaythrough', () => this.waiting = false);
    this.$refs.audio.addEventListener('progress', () => this.buffered = this.$refs.audio.buffered);
  },
  methods: {
    onPlayPause() {
      if (this.paused) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
    },
    onStop() {
      this.$refs.audio.pause();
      this.$refs.audio.currentTime = 0;
    },
    async onRemove() {
      await this.$store.dispatch('gallery/removeFile', { fileId: this.audio.id });
    }
  },
  computed: {
    time() {
      const normalize = time => String(Math.floor(time)).padStart(2, '0');
      const currentTime = {
        minutes: normalize(this.currentTime / 60),
        seconds: normalize(this.currentTime % 60)
      };

      const duration = {
        minutes: normalize(this.duration / 60),
        seconds: normalize(this.duration % 60)
      };

      return `${currentTime.minutes}:${currentTime.seconds}/${duration.minutes}:${duration.seconds}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../main";

.card-content {
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0);

  padding: 0.5rem;

  transition: border-color 200ms;

  display: flex;
  align-items: center;

  position: relative;
}

.card-content:hover {
  border-color: $secondary;
}

.play-pause-button, .stop-button, .time {
  margin-right: 0.5rem;
}

.middle-group {
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.middle-group > .text-data {
  margin: 0 1rem;

  display: flex;
  justify-content: space-between;
}

.filename {
  font-weight: bold;
}
.menu-icon {
  transition: red 200ms;
  padding: 0 0.5rem;
}

.menu-icon:hover {
  color: $primary;
}

.item {
  transition: color 200ms;

  display: flex;
  align-items: center;
}

.dropdown-icon {
  margin-right: 0.5rem;
}

.item:hover {
  color: $secondary !important;
  background: transparent !important;
}

.item-remove:hover {
  color: $danger !important;
}
</style>
