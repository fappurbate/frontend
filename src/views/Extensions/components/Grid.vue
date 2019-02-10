<template>
  <div class="grid">
    <Extension
      v-for="extension of extensions"
      :key="extension._id"
      :extension="extension" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Extension from '../../../components/Extension';

export default {
  components: {
    Extension
  },
  computed: {
    ...mapState({
      extensions: state => state.extensionsPage.data
    })
  }
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 340px);
  grid-gap: 1rem;
  place-content: center;

  max-width: 1400px;
}
</style>
