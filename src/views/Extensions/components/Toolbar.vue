<template>
  <div class="navbar">
    <div class="navbar-item">
      <InstallButton />
    </div>
  </div>
</template>

<script>
import InstallButton from './InstallButton';

export default {
  components: {
    InstallButton
  }
};
</script>

<style scoped>
.navbar {
  height: 64px;
  min-height: 64px;
  z-index: unset;
}
</style>
