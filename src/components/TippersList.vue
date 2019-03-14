<template>
  <div class="tippers-container">
    <div class="data-container">
      <b-table
          :data="tippers"
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
    <button class="load-more button is-text is-rounded" @click="$emit('more')">
      More
    </button>
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

.load-more {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -150%);

  transition: opacity $color-change-duration;
  opacity: 0.5;
}

.load-more:hover {
  opacity: 1;
}

.load-more:focus {
  border: 0;
  box-shadow: none;
}
</style>
