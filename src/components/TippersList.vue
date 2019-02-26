<template>
  <div class="tippers-container">
    <div class="data-container">
      <b-table
          :data="tippers.rows"
          striped
          narrowed
          hoverable
          :loading="loading"
          :mobile-cards="false">
        <template slot-scope="props">
          <b-table-column field="username" label="Username" width="40">
            {{ props.row.username }}
          </b-table-column>

          <b-table-column field="amount" label="Amount" numeric>
            {{ props.row.amount }}
          </b-table-column>
        </template>
      </b-table>
    </div>
    <b-pagination
      v-if="tippers"
      class="pagination"
      per-page="50"
      order="is-centered"
      :total="tippers.total"
      :current="tippers.page"
      @change="value => value > 0 && $router.push(`/${$route.params.broadcaster}/tippers?page=${value}`)">
    </b-pagination>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      tippers: state => state.tippersPage.data,
      loading: state => state.tippersPage.loading
    })
  }
}
</script>

<style scoped>
.tippers-container {
  overflow: hidden;
}

.data-container {
  overflow-y: auto;
}

.pagination {
  height: 48px;
  min-height: 48px;
  margin-top: 0.5rem;
}

.amount {
  float: right;
}
</style>
