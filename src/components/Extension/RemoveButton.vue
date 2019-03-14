<template>
  <a class="remove" @click="onClick">
    <b-loading v-if="loading"></b-loading>
    Remove
  </a>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from '@fappurbate/fappify/dist/components/toast';

export default {
  props: ['extension'],
  data: () => ({
    loading: false,
    error: null
  }),
  methods: {
    async onClick() {
      this.loading = true;

      try {
        await this.$store.dispatch(`extension/remove`, { id: this.extension.id });
        this.error = null;
        Toast.open({
          message: 'Extension removed!',
          type: 'is-success'
        });
      } catch (error) {
        this.error = error.message;
        this.$dialog.alert({
          title: 'Error',
          message: `Failed to remove extension: ${this.error}`,
          type: 'is-danger'
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

a.remove {
  transition: color $color-change-duration;
}

a.remove:hover {
  color: $danger;
}
</style>
