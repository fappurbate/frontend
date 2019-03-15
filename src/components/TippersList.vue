<template>
  <div class="tippers-container">
    <div class="data-container">
      <b-table
          :data="data.items"
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

    <MoreButton @more="$emit('more')" :disabled="data.all" />
  </div>
</template>

<script>
import { mapState } from 'vuex';

import MoreButton from './MoreButton';

export default {
  components: {
    MoreButton
  },
  computed: {
    ...mapState({
      data: state => state.tippersPage.data,
      loading: state => state.tippersPage.loading
    })
  }
}
</script>

<style lang="scss" scoped>
@import "../main";

.tippers-container {
  overflow: hidden;
}

.data-container {
  overflow-y: auto;
}

.amount {
  float: right;
}
</style>
