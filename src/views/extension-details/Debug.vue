<template>
  <ExtensionLogs class="logs" :logs="data" />
</template>

<script>
import ExtensionLogs from '../../components/ExtensionLogs';
import * as WS from '../../common/ws';

export default {
  components: {
    ExtensionLogs
  },
  data: () => ({
    loading: false,
    error: null,
    data: []
  }),
  methods: {
    async getLogs(broadcaster) {
      this.loading = true;

      try {
        this.data = await this.$store.dispatch('extensions/getLogs', {
          id: this.$route.params.extensionId,
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
      const { extension, info } = event.detail;

      this.data.unshift(info);
    }
  },
  async created() {
    await this.getLogs(this.$route.params.broadcaster);

    WS.events.addEventListener('extension-log', this.onLog);
  },
  beforeDestroy() {
    WS.events.removeEventListener('extension-log', this.onLog);
  },
  async beforeRouteUpdate(to, from, next) {
    await this.getLogs(to.params.broadcaster);
    next();
  }
};
</script>

<style scoped>
.logs {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;

  overflow-y: scroll;

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
}
</style>
