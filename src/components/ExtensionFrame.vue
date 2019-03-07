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
    }
  },
  methods: {
    frameWindow() {
      return this.$refs.frame ? this.$refs.frame.contentWindow : null;
    },
    postMessage(message) {
      if (this.frameWindow()) {
        this.frameWindow().postMessage(message, '*');
      }
    },
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
        if (!this.frameWindow()) { return; }
        if (event.source !== this.frameWindow()) { return; }

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

            this.postMessage({
              subject: 'response',
              data: {
                requestId,
                data: result
              }
            });
          } catch (error) {
            this.postMessage({
              subject: 'response',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            });
          }
        } else if (event.data.subject === 'is-broadcasting') {
          const { requestId } = event.data.data;

          try {
            const result = await WS.request('is-broadcasting', {
              broadcaster: this.$route.params.broadcaster
            });

            this.postMessage({
              subject: 'is-broadcasting',
              data: {
                requestId,
                data: result
              }
            });
          } catch (error) {
            this.postMessage({
              subject: 'is-broadcasting',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            });
          }
        } else if (event.data.subject === 'is-extracting-account-activity') {
          const { requestId } = event.data.data;

          try {
            const result = await WS.request('is-extracting-account-activity', {
              username: this.$route.params.broadcaster
            });

            this.postMessage({
              subject: 'is-extracting-account-activity',
              data: {
                requestId,
                data: result
              }
            });
          } catch (error) {
            this.postMessage({
              subject: 'is-extracting-account-activity',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            });
          }
        } else if (event.data.subject === 'send-message') {
          const { message } = event.data.data;

          WS.emit('send-message', {
            broadcaster: this.$route.params.broadcaster,
            message
          });
        } else if (event.data.subject === 'gallery-select') {
          const { requestId, type, multiple } = event.data.data;

          const selection = await this.$gallery.select({ type, multiple });
          this.postMessage({
            subject: 'gallery-select',
            data: { requestId, data: selection }
          });
        } else if (event.data.subject === 'request-thumbnail') {
          const { requestId, id, size } = event.data.data;

          try {
            const thumbnail = await this.$store.dispatch('gallery/images/getThumbnail', {
              fileId: id,
              size
            });
            this.postMessage({
              subject: 'response-thumbnail',
              data: { requestId, data: thumbnail }
            });
          } catch (error) {
            this.postMessage({
              subject: 'response-thumbnail',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            });
          }
        } else if (event.data.subject === 'request-preview') {
          const { requestId, id } = event.data.data;

          try {
            const preview = await this.$store.dispatch('gallery/images/getPreview', {
              fileId: id,
              encoding: 'base64'
            });
            this.postMessage({
              subject: 'response-preview',
              data: { requestId, data: preview }
            });
          } catch (error) {
            this.postMessage({
              subject: 'response-preview',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            });
          }
        } else if (event.data.subject === 'request-file') {
          const { requestId, id } = event.data.data;

          try {
            const file = await this.$store.dispatch('gallery/getFile', {
              fileId: id,
              encoding: 'base64'
            });
            this.postMessage({
              subject: 'response-file',
              data: { requestId, data: file }
            });
          } catch (error) {
            this.postMessage({
              subject: 'response-file',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            });
          }
        } else if (event.data.subject === 'request-metadata') {
          const { requestId, id } = event.data.data;

          try {
            const metadata = await this.$store.dispatch('gallery/getMetadata', {
              fileId: id
            });
            this.postMessage({
              subject: 'response-metadata',
              data: { requestId, data: metadata }
            });
          } catch (error) {
            this.postMessage({
              subject: 'response-metadata',
              data: {
                requestId,
                error: error.message,
                ...error.data && { data: error.data }
              }
            });
          }
        }
      });

      WS.events.addEventListener('extension-event', this.onWSExtensionEvent = event => {
        const { id, broadcaster, receivers, sender, subject, data } = event.detail;

        if (!this.frameWindow()) { return; }

        if (id !== this.extension._id || broadcaster !== this.$route.params.broadcaster ||
            !receivers.includes(this.name)) {
          return;
        }

        this.postMessage({
          subject: 'event',
          data: { subject, sender, data }
        });
      });

      WS.events.addEventListener('message', this.onWSMessage = event => {
        const { info, type, timestamp, data } = event.detail;

        if (!this.frameWindow()) { return; }

        if (!info.broadcast.active || !info.chat.active ||
            info.chat.owner !== this.$route.params.broadcaster) {
          return;
        }

        this.postMessage({
          subject: 'message',
          data: { type, timestamp: new Date(timestamp), data }
        });
      });

      WS.events.addEventListener('account-activity', this.onWSAccountActivity = event => {
        const { username, type, timestamp, data } = event.detail;

        if (!this.frameWindow()) { return; }

        if (username !== this.$route.params.broadcaster) { return; }

        this.postMessage({
          subject: 'account-activity',
          data: { type, timestamp: new Date(timestamp), data }
        });
      });

      WS.events.addEventListener('broadcast-start', this.onWSBroadcastStart = event => {
        const { broadcaster } = event.detail;

        if (!this.frameWindow()) { return; }

        if (broadcaster !== this.$route.params.broadcaster) { return; }

        this.postMessage({
          subject: 'broadcast-start'
        });
      });

      WS.events.addEventListener('broadcast-stop', this.onWSBroadcastStop = event => {
        const { broadcaster } = event.detail;

        if (!this.frameWindow()) { return; }

        if (broadcaster !== this.$route.params.broadcaster) { return; }

        this.postMessage({
          subject: 'broadcast-stop'
        });
      });

      WS.events.addEventListener('extract-account-activity-start', this.onWSExtractAccountActivityStart = event => {
        const { username } = event.detail;

        if (!this.frameWindow()) { return; }

        if (username !== this.$route.params.broadcaster) { return; }

        this.postMessage({
          subject: 'extract-account-activity-start'
        });
      });

      WS.events.addEventListener('extract-account-activity-stop', this.onWSExtractAccountActivityStop = event => {
        const { username } = event.detail;

        if (!this.frameWindow()) { return; }

        if (username !== this.$route.params.broadcaster) { return; }

        this.postMessage({
          subject: 'extract-account-activity-stop'
        });
      });

      WS.events.addEventListener('gallery-add', this.onWSGalleryAdd = event => {
        const { file } = event.detail;

        if (!this.frameWindow()) { return; }

        this.postMessage({
          subject: 'gallery-add',
          data: { file }
        });
      });

      WS.events.addEventListener('gallery-remove', this.onWSGalleryRemove = event => {
        const { file } = event.detail;

        if (!this.frameWindow()) { return; }

        this.postMessage({
          subject: 'gallery-remove',
          data: { file }
        });
      });
    },
    teardownCommunication() {
      WS.events.removeEventListener('gallery-remove', this.onWSGalleryRemove);
      WS.events.removeEventListener('gallery-add', this.onWSGalleryAdd);
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
  async mounted() {
    await this.update();
    this.setupCommunication();
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
