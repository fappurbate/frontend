<template>
  <div class="grid mx-auto pa-3">
    <Extension
      v-for="extension of extensions"
      :key="extension._id"
      :extension="extension" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Extension from '../Extension';

export default {
  components: {
    Extension
  },
  computed: {
    ...mapState({
      extensions: state => state.extensionsList.data
    })
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 360px);
  grid-gap: 1rem;
  place-content: center;

  max-width: 1400px;
}
</style>
