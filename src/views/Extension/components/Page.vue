this.onExtensionEvent<template>
  <Frame ref="frame" :srcdoc="pageWithData" />
</template>

<script>
import { mapState } from 'vuex';
import * as WS from '../../../common/ws';
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
    }),
    pageWithData() {
      if (this.data === null) { return null; }

      const toInject = `
        <meta data-name="id" data-content="${this.$route.params.extensionId}" />
        <meta data-name="name" data-content="${this.extension.name}" />
        ${this.extension.version
          ? '<meta data-name="version" data-content="${this.extension.version}" />'
          : ''}
        <meta data-name="broadcaster" data-content="${this.$route.params.broadcaster}" />
      `;

      return `${toInject}${this.data}`;
    }
  },
  data: () => ({
    loading: false,
    error: null,
    data: null,

    onExtensionEvent: null,
    onMessage: null
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
    setupCommunication() {
      window.addEventListener('message', this.onMessage = async event => {
        if (event.source !== this.$refs.frame.$el.contentWindow) { return; }

        if (event.data.subject === 'event') {
          const { receivers, subject, data } = event.data.data;

          WS.emit('extension-event', {
            id: this.extension._id,
            broadcaster: this.$route.params.broadcaster,
            receivers,
            sender: this.name,
            subject,
            ...data && { data }
          });
        } else if (event.data.subject === 'request') {
          const { requestId, subject, data } = event.data.data;

          try {
            const result = await WS.request('extension-request', {
              id: this.extension._id,
              broadcaster: this.$route.params.broadcaster,
              sender: this.name,
              subject,
              ...data && { data }
            });

            this.$refs.frame.$el.contentWindow.postMessage({
              subject: 'response',
              data: {
                requestId,
                data: result
              }
            }, '*');
          } catch (error) {
            this.$refs.frame.$el.contentWindow.postMessage({
              subject: 'response',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            }, '*');
          }
        }
      });

      WS.events.addEventListener('extension-event', this.onExtensionEvent = event => {
        const { id, broadcaster, receivers, sender, subject, data } = event.detail;

        if (id !== this.extension._id || broadcaster !== this.$route.params.broadcaster ||
            !receivers.includes(this.name)) {
          return;
        }

        this.$refs.frame.$el.contentWindow.postMessage({
          subject: 'event',
          data: { subject, sender, data }
        }, '*');
      });
    }
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
    this.setupCommunication();
  },
  destroyed() {
    WS.events.removeEventListener('extension-event', this.onExtensionEvent)
    window.removeEventListener('message', this.onMessage);
  }
};
</script>

<style scoped>
</style>
