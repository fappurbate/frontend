<template>
  <div>
    <button class="button is-rounded is-secondary is-hidden-mobile" @click="onClick">
      <b-icon icon="plus"></b-icon>
      <span>Upload</span>
    </button>
    <button class="button is-rounded is-secondary is-hidden-tablet" @click="onClick">
      <b-icon icon="plus"></b-icon>
    </button>

    <b-modal :active.sync="modalActive" has-modal-card>
      <div class="card">
        <div class="card-content">
          <b-field label="Filename">
            <b-input ref="filename" v-model="filename" maxlength="100"></b-input>
          </b-field>
          <b-field class="upload-field">
            <b-upload v-model="file" drag-drop accept="audio/*,image/*"
                :loading="loading" :disabled="!filename">
              <section class="section upload-section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="upload" size="is-large"></b-icon>
                  </p>
                  <p>Drop your files here or click to upload</p>
                 </div>
              </section>
            </b-upload>
          </b-field>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Toast } from 'buefy/dist/components/toast';

export default {
  data: () => ({
    modalActive: false,
    filename: '',
    file: []
  }),
  computed: {
    ...mapState({
      loading: state => state.gallery.upload.loading,
      error: state => state.gallery.upload.error
    }),
    type(state) {
      if (!state.file) { return ''; }
      if (state.file.type.startsWith('image/')) { return 'image'; }
      if (state.file.type.startsWith('audio/')) { return 'audio'; }
    }
  },
  methods: {
    onClick() {
      this.modalActive = true;
      setTimeout(() => {
        this.$refs.filename.focus();
      });
    }
  },
  watch: {
    async file(to, from) {
      if (!to) { return; }

      await this.$store.dispatch('gallery/upload', {
        type: this.type,
        filename: this.filename,
        file: this.file
      });
      if (this.error) {
        this.$dialog.alert({
          title: 'Error',
          message: `Failed to upload file: ${this.error}`,
          type: 'is-danger'
        });
      } else {
        Toast.open({
          message: 'File upload finished!',
          type: 'is-success'
        });
        this.modalActive = false;
        this.filename = '';
      }
    }
  }
};
</script>

<style scoped>
.upload-field {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
