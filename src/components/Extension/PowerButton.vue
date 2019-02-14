<template>
  <a :class="{ [running ? 'stop' : 'start']: true, power: true }" @click="onClick">
    <b-loading v-if="loading"></b-loading>
    {{ running ? 'Stop' : 'Start' }}
  </a>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: ['extension'],
  data: () => ({
    loading: false,
    error: null
  }),
  computed: {
    running() {
      return this.extension.running;
    }
  },
  methods: {
    async onClick() {
      this.loading = true;

      const action = this.running ? 'stop' : 'start';

      try {
        await this.$store.dispatch(`extension/${action}`, {
          id: this.extension._id,
          broadcaster: this.$route.params.broadcaster
        });
        this.error = null;
      } catch (error) {
        this.error = error.message;
        this.$dialog.alert({
          title: 'Error',
          message: `Failed to ${this.running ? 'stop' : 'start'} extension: ${this.error}`,
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

a.power {
  transition: color 200ms;
}

a.start:hover {
  color: $secondary;
}

a.stop:hover {
  color: $warning;
}
</style>
