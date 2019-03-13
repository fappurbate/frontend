<template>
  <Logs class="logs" :logs="data" />
</template>

<script>
import Logs from '../../../components/ExtensionLogs';
import * as WS from '../../../common/ws';

export default {
  components: {
    Logs
  },
  data: () => ({
    loading: false,
    error: null,
    data: []
  }),
  methods: {
    async getLogs(options = {}) {
      const {
        id = this.$route.params.extensionId,
        broadcaster = this.$route.params.broadcaster
      } = options;

      this.loading = true;

      try {
        this.data = await this.$store.dispatch('extension/getLogs', {
          id,
          broadcaster
        });
        this.error = null;
      } catch (error) {
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    onLog(event) {
      const { extension, info, broadcaster } = event.detail;

      if (extension.id === this.$route.params.extensionId &&
          broadcaster === this.$route.params.broadcaster) {
        this.data.unshift(info);
      }
    }
  },
  watch: {
    async '$route.params.broadcaster'(to, from) {
      await this.getLogs({ broadcaster: to });
    },
    async '$route.params.extensionId'(to, from) {
      await this.getLogs({ id: to });
    }
  },
  async created() {
    await this.getLogs();

    WS.events.addEventListener('extension-log', this.onLog);
  },
  beforeDestroy() {
    WS.events.removeEventListener('extension-log', this.onLog);
  }
};
</script>

<style scoped>
.logs {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  overflow-y: scroll;
  height: 100%;
}
</style>
