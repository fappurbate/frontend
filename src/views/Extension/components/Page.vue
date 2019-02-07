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
          ? `<meta data-name="version" data-content="${this.extension.version}" />`
          : ``}
        <meta data-name="broadcaster" data-content="${this.$route.params.broadcaster}" />
      `;

      return `${toInject}${this.data}`;
    }
  },
  data: () => ({
    loading: false,
    error: null,
    data: null,

    onFrameMessage: null,
    onWSExtensionEvent: null,
    onWSMessage: null
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
      window.addEventListener('message', this.onFrameMessage = async event => {
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

      WS.events.addEventListener('extension-event', this.onWSExtensionEvent = event => {
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

      WS.events.addEventListener('message', this.onWSMessage = event => {
        const { info, type, timestamp, data } = event.detail;

        if (!info.broadcast.active || !info.chat.active || !info.chat.ready ||
            info.chat.owner !== this.$route.params.broadcaster) {
          return;
        }

        this.$refs.frame.$el.contentWindow.postMessage({
          subject: 'message',
          data: { type, timestamp: new Date(timestamp), data }
        }, '*');
      });

      WS.events.addEventListener('account-activity', this.onWSAccountActivity = event => {
        const { username, type, timestamp, data } = event.detail;

        if (username !== this.$route.params.broadcaster) { return; }

        this.$refs.frame.$el.contentWindow.postMessage({
          subject: 'account-activity',
          data: { type, timestamp: new Date(timestamp), data }
        }, '*');
      });

      WS.events.addEventListener('broadcast-start', this.onWSBroadcastStart = event => {
        const { broadcaster } = event.detail;

        if (broadcaster !== this.$route.params.broadcaster) { return; }

        this.$refs.frame.$el.contentWindow.postMessage({
          subject: 'broadcast-start'
        }, '*');
      });

      WS.events.addEventListener('broadcast-stop', this.onWSBroadcastStop = event => {
        const { broadcaster } = event.detail;

        if (broadcaster !== this.$route.params.broadcaster) { return; }

        this.$refs.frame.$el.contentWindow.postMessage({
          subject: 'broadcast-stop'
        }, '*');
      });

      WS.events.addEventListener('extract-account-activity-start', this.onWSExtractAccountActivityStart = event => {
        const { username } = event.detail;

        if (username !== this.$route.params.broadcaster) { return; }

        this.$refs.frame.$el.contentWindow.postMessage({
          subject: 'extract-account-activity-start'
        }, '*');
      });

      WS.events.addEventListener('extract-account-activity-stop', this.onWSExtractAccountActivityStop = event => {
        const { username } = event.detail;

        if (username !== this.$route.params.broadcaster) { return; }

        this.$refs.frame.$el.contentWindow.postMessage({
          subject: 'extract-account-activity-stop'
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
    WS.events.removeEventListener('extract-account-activity-stop', this.onWSExtractAccountActivityStop);
    WS.events.removeEventListener('extract-account-activity-start', this.onWSExtractAccountActivityStart);
    WS.events.removeEventListener('broadcast-stop', this.onWSBroadcastStop);
    WS.events.removeEventListener('broadcast-start', this.onWSBroadcastStart);
    WS.events.removeEventListener('account-activity', this.onWSAccountActivity);
    WS.events.removeEventListener('message', this.onWSMessage);
    WS.events.removeEventListener('extension-event', this.onWSExtensionEvent)
    window.removeEventListener('message', this.onFrameMessage);
  }
};
</script>

<style scoped>
</style>
