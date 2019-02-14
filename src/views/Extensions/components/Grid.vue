<template>
  <div class="grid-container">
    <div class="grid">
      <Extension
        v-for="extension of extensions.rows"
        :key="extension._id"
        :extension="extension" />
    </div>
    <b-pagination
      v-if="extensions"
      class="pagination"
      per-page="10"
      order="is-centered"
      :total="extensions.total"
      :current="extensions.page"
      @change="value => $router.push(`/${$route.params.broadcaster}/extensions?page=${value}`)">
    </b-pagination>
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

.pagination {
  height: 48px;
  min-height: 48px;
  margin-top: 0.5rem;
}
</style>
