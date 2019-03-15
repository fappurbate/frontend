<template>
  <div class="grid-container">
    <div class="grid">
      <Extension
        v-for="extension of data.items"
        :key="extension.id"
        :extension="extension" />
    </div>
    <MoreButton @more="$emit('more')" :disabled="data.all" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Extension from '../../../components/Extension';
import MoreButton from '../../../components/MoreButton';

export default {
  components: {
    Extension,
    MoreButton
  },
  computed: {
    ...mapState({
      data: state => state.extensionsPage.data,
      loading: state => state.extensionsPage.loading
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../../../main";

.grid-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;

  overflow: hidden;

  margin: 1.5rem;
  margin-top: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
  grid-gap: 1rem;
  justify-content: center;
  max-width: 1400px;

  overflow-y: auto;
  padding: 1rem;
}
</style>
