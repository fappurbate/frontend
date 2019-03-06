<template>
  <div class="global-container">
    <router-view />
    <FileSelectionDialog />
  </div>
</template>

<script>
import FileSelectionDialog from './components/FileSelectionDialog';

export default {
  components: {
    FileSelectionDialog
  }
};
</script>

<style scoped>
.global-container {
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss">
@import "main";
</style>
