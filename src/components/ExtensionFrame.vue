<template>
  <iframe class="page" ref="page" :srcdoc="srcdoc" sandbox="allow-scripts"
    frameborder="0">
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
}
</style>
