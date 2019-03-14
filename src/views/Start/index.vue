<template>
  <div class="start-screen">
    <div class="fb-title">Fappurbate</div>
    <div class="chooser-container">
      <BroadcasterChooser />
    </div>
  </div>
</template>

<script>
import BroadcasterChooser from './components/BroadcasterChooser';

export default {
  components: {
    BroadcasterChooser
  }
}
</script>

<style lang="scss" scoped>
@import "../../main";

.start-screen {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.fb-title {
  font-size: 10vh;
  text-align: center;
  margin-top: 30vh;
  margin-bottom: 10vh;
  cursor: default;
  transition: color $color-change-duration;
}

.fb-title:hover {
  color: $secondary;
}

.chooser-container {
  display: flex;
  justify-content: center;
}
</style>
