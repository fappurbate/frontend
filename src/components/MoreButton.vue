<template>
  <button class="more-button button is-text is-rounded" @click="$emit('more')">
    More
  </button>
</template>

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
