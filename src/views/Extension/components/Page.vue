<template>
  <Frame ref="frame" :srcdoc="data" :extension="extension" :name="name" />
</template>

<script>
import { mapState } from 'vuex';
import Frame from '../../../components/ExtensionFrame';

export default {
  components: {
    Frame
  },
  props: {
    name: String
  },
  computed: {
    ...mapState({
      extension: state => state.extensionPage.data
    })
  },
  data: () => ({
    loading: false,
    error: null,
    data: null
  }),
  methods: {
    async getPage(options = {}) {
      const {
        id = this.$route.params.extensionId,
        broadcaster = this.$route.params.broadcaster
      } = options;

      this.loading = true;

      try {
        this.data = await this.$store.dispatch('extension/getPage', {
          id: this.$route.params.extensionId,
          broadcaster,
          name: this.name
        });
        this.error = null;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
  },
  watch: {
    async '$route.params.extensionId'(to, from) {
      await this.getPage({ id: to });
    },
    async '$route.params.broadcaster'(to, from) {
      await this.getPage({ broadcaster: to });
    }
  },
  async created() {
    await this.getPage();
  }
};
</script>

<style scoped>
</style>
