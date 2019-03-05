<template>
  <div class="timeline-container"
      :style="{
        height,
        marginLeft: halfHeight,
        marginRight: halfHeight
      }">
    <div class="timeline-left" :style="{ right: timeToPercent(duration - currentTime) }">
    </div>
    <div class="timeline-right" :style="{ left: timeToPercent(currentTime) }">
    </div>

    <!-- <div class="timeline-buffer" :key="index"
      v-for="index in bufferedLength"
      :style="{
        left: timeToPercent(buffered.start(index - 1)),
        right: timeToPercent(buffered.end(index - 1))
      }">
    </div> -->

    <div class="timeline-overlay" :style="{ cursor: disabled || !clickable ? 'default' : 'pointer' }" @mouseup="onSeek">
    </div>

    <div class="slider"
      :style="{
        height: sliderSize,
        width: sliderSize,
        left: timeToPercent(currentTime),
        cursor: disabled || !clickable ? 'default' : 'pointer'
      }">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    height: { type: String, default: '24px' },
    currentTime: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    disabled: { type: Boolean, default: false },
    clickable: { type: Boolean, default: true },
    buffered: TimeRanges
  },
  computed: {
    halfHeight() {
      return `calc(${this.height} / 2)`;
    },
    sliderSize() {
      return `calc(${this.height} / 1.5)`;
    },
    bufferedLength() {
      return this.buffered ? this.buffered.length : 0;
    }
  },
  methods: {
    onSeek(event) {
      if (!this.clickable) { return; }

      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - Math.floor(rect.left);
      const newTime = Math.floor(x / event.target.clientWidth * this.duration);

      this.$emit('seek', newTime);
    },
    timeToPercent(time) {
      return `${this.duration > 0 ? Math.min(time / this.duration, 1) * 100 : 0}%`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../main";

.timeline-container {
  position: relative;
}

.timeline-left, .timeline-right, .timeline-buffer, .timeline-overlay {
  height: 4px;

  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  border-radius: 1px;
}

.timeline-left {
  background-color: $secondary;
  left: 0;
}

.timeline-right {
  background-color: $light;
  right: 0;
}

.timeline-buffer {
  background-color: $dark;
}

.timeline-overlay {
  left: 0;
  right: 0;
}

.slider {
  background-color: $secondary;
  border-radius: 50%;

  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
