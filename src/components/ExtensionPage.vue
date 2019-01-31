<template>
  <iframe class="page" ref="page" :srcdoc="srcdoc" sandbox="allow-scripts">
  </iframe>
</template>

<script>
export default {
  props: ['srcdoc']
};
</script>

<style scoped>
.page {
  width: 100%;
  border: 0;

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
}
</style>
