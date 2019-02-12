<template>
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
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      tippers: state => state.tippers.data,
      loading: state => state.tippers.loading
    })
  }
}
</script>

<style scoped>
.amount {
  float: right;
}
</style>
