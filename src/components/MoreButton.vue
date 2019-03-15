<template>
  <button class="more-button button is-text is-rounded" @more="$emit('more')" :disabled="disabled">
    More
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      optional: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../main";

.more-button {
  position: absolute !important;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -150%);

  transition: opacity $color-change-duration;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }

  &:focus {
    border: 0;
    box-shadow: none;
  }
}
</style>
