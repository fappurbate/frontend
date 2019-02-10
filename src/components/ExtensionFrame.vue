<template>
  <iframe v-if="ready" class="page" ref="frame" :srcdoc="finalSrcdoc"
    sandbox="allow-scripts" frameborder="0">
  </iframe>
</template>

<script>
import * as WS from '../common/ws';

export default {
  props: {
    srcdoc: String,
    extension: Object
  },
  data: () => ({
    updated: false
  }),
  computed: {
    ready() {
      return Boolean(this.updated && this.srcdoc && this.extension);
    },
    finalSrcdoc() {
      if (!this.srcdoc) { return null; }

      const toInject = `
        <meta data-name="id" data-content="${this.extension._id}" />
        <meta data-name="name" data-content="${this.extension.name}" />
        ${this.extension.version
          ? `<meta data-name="version" data-content="${this.extension.version}" />`
          : ``}
        <meta data-name="broadcaster" data-content="${this.$route.params.broadcaster}" />
        <meta data-name="init:is-broadcasting" data-content="${this.isBroadcasting}" />
        <meta data-name="init:is-extracting-account-activity" data-content="${this.isExtractingAccountActivity}" />
      `;

      return `${toInject}${this.srcdoc}`;
    },
    frameWindow() {
      return this.$refs.frame ? this.$refs.frame.contentWindow : null;
    }
  },
  methods: {
    async getInitialData() {
      this.isBroadcasting = await WS.request('is-broadcasting', {
        broadcaster: this.$route.params.broadcaster
      });
      this.isExtractingAccountActivity = await WS.request('is-extracting-account-activity', {
        username: this.$route.params.broadcaster
      });
    },
    setupCommunication() {
      window.addEventListener('message', this.onFrameMessage = async event => {
        if (!this.frameWindow) { return; }
        if (event.source !== this.frameWindow) { return; }

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

            this.frameWindow.postMessage({
              subject: 'response',
              data: {
                requestId,
                data: result
              }
            }, '*');
          } catch (error) {
            this.frameWindow.postMessage({
              subject: 'response',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            }, '*');
          }
        } else if (event.data.subject === 'is-broadcasting') {
          const { requestId } = event.data.data;

          try {
            const result = await WS.request('is-broadcasting', {
              broadcaster: this.$route.params.broadcaster
            });

            this.frameWindow.postMessage({
              subject: 'is-broadcasting',
              data: {
                requestId,
                data: result
              }
            }, '*');
          } catch (error) {
            this.frameWindow.postMessage({
              subject: 'is-broadcasting',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            }, '*');
          }
        } else if (event.data.subject === 'is-extracting-account-activity') {
          const { requestId } = event.data.data;

          try {
            const result = await WS.request('is-extracting-account-activity', {
              username: this.$route.params.broadcaster
            });

            this.frameWindow.postMessage({
              subject: 'is-extracting-account-activity',
              data: {
                requestId,
                data: result
              }
            }, '*');
          } catch (error) {
            this.frameWindow.postMessage({
              subject: 'is-extracting-account-activity',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            }, '*');
          }
        } else if (event.data.subject === 'send-message') {
          const { message } = event.data.data;

          WS.emit('send-message', {
            broadcaster: this.$route.params.broadcaster,
            message
          });
        }
      });

      WS.events.addEventListener('extension-event', this.onWSExtensionEvent = event => {
        const { id, broadcaster, receivers, sender, subject, data } = event.detail;

        if (!this.frameWindow) { return; }

        if (id !== this.extension._id || broadcaster !== this.$route.params.broadcaster ||
            !receivers.includes(this.name)) {
          return;
        }

        this.frameWindow.postMessage({
          subject: 'event',
          data: { subject, sender, data }
        }, '*');
      });

      WS.events.addEventListener('message', this.onWSMessage = event => {
        const { info, type, timestamp, data } = event.detail;

        if (!this.frameWindow) { return; }

        if (!info.broadcast.active || !info.chat.active ||
            info.chat.owner !== this.$route.params.broadcaster) {
          return;
        }

        this.frameWindow.postMessage({
          subject: 'message',
          data: { type, timestamp: new Date(timestamp), data }
        }, '*');
      });

      WS.events.addEventListener('account-activity', this.onWSAccountActivity = event => {
        const { username, type, timestamp, data } = event.detail;

        if (!this.frameWindow) { return; }

        if (username !== this.$route.params.broadcaster) { return; }

        this.frameWindow.postMessage({
          subject: 'account-activity',
          data: { type, timestamp: new Date(timestamp), data }
        }, '*');
      });

      WS.events.addEventListener('broadcast-start', this.onWSBroadcastStart = event => {
        const { broadcaster } = event.detail;

        if (!this.frameWindow) { return; }

        if (broadcaster !== this.$route.params.broadcaster) { return; }

        this.frameWindow.postMessage({
          subject: 'broadcast-start'
        }, '*');
      });

      WS.events.addEventListener('broadcast-stop', this.onWSBroadcastStop = event => {
        const { broadcaster } = event.detail;

        if (!this.frameWindow) { return; }

        if (broadcaster !== this.$route.params.broadcaster) { return; }

        this.frameWindow.postMessage({
          subject: 'broadcast-stop'
        }, '*');
      });

      WS.events.addEventListener('extract-account-activity-start', this.onWSExtractAccountActivityStart = event => {
        const { username } = event.detail;

        if (!this.frameWindow) { return; }

        if (username !== this.$route.params.broadcaster) { return; }

        this.frameWindow.postMessage({
          subject: 'extract-account-activity-start'
        }, '*');
      });

      WS.events.addEventListener('extract-account-activity-stop', this.onWSExtractAccountActivityStop = event => {
        const { username } = event.detail;

        if (!this.frameWindow) { return; }

        if (username !== this.$route.params.broadcaster) { return; }

        this.frameWindow.postMessage({
          subject: 'extract-account-activity-stop'
        }, '*');
      });
    },
    teardownCommunication() {
      WS.events.removeEventListener('extract-account-activity-stop', this.onWSExtractAccountActivityStop);
      WS.events.removeEventListener('extract-account-activity-start', this.onWSExtractAccountActivityStart);
      WS.events.removeEventListener('broadcast-stop', this.onWSBroadcastStop);
      WS.events.removeEventListener('broadcast-start', this.onWSBroadcastStart);
      WS.events.removeEventListener('account-activity', this.onWSAccountActivity);
      WS.events.removeEventListener('message', this.onWSMessage);
      WS.events.removeEventListener('extension-event', this.onWSExtensionEvent)
      window.removeEventListener('message', this.onFrameMessage);
    },
    async update() {
      this.updated = false;
      await this.getInitialData();
      this.updated = true;
    }
  },
  watch: {
    async srcdoc(to, from) {
      await this.update();
    }
  },
  async created() {
    this.setupCommunication();
    await this.update();
  },
  destroyed() {
    this.teardownCommunication();
  }
};
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
