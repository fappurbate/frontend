<template>
  <b-modal :active.sync="open" has-modal-card :onCancel="() => onCancel()">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="card-title">
          {{ title }}
        </p>
      </header>
      <section class="modal-card-body">
        <ImagesGrid v-if="type === 'images'" select :multiple="multiple"
          v-model="selection" size="medium" />
        <AudioList v-else-if="type === 'audio'" select :multiple="multiple"
          v-model="selection" />
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="onCancel">
          Cancel
        </button>
        <button class="button is-primary" :disabled="!selected" @click="onSelect">
          Select
        </button>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import ImagesGrid from './ImagesGrid';
import AudioList from './AudioList';

export default {
  components: {
    ImagesGrid,
    AudioList
  },
  watch: {
    multiple: {
      immediate: true,
      handler(value) {
        this.selection = value ? [] : null;
      }
    },
    async open(value) {
      if (value) {
        await this.$store.dispatch(`gallery/${this.type}/update`);
      }
    }
  },
  computed: {
    title() {
      if (this.type === 'images') {
        return this.multiple ? 'Select Images' : 'Select Image';
      } else if (this.type === 'audio') {
        return 'Select Audio';
      }
    },
    selected() {
      if (!this.selection) { return false; }

      return this.multiple ? this.selection.length > 0 : Boolean(this.selection);
    },
    selection: {
      get() {
        return this.$store.state.fileSelectionDialog.selection;
      },
      set(value) {
        this.$store.state.fileSelectionDialog.selection = value;
      }
    },
    open: {
      get() {
        return this.$store.state.fileSelectionDialog.open;
      },
      set(value) {
        this.$store.state.fileSelectionDialog.open = value;
      }
    },
    type() {
      return this.$store.state.fileSelectionDialog.type;
    },
    multiple() {
      return this.$store.state.fileSelectionDialog.multiple;
    }
  },
  methods: {
    async onCancel() {
      await this.$store.dispatch(`fileSelectionDialog/cancel`);
    },
    async onSelect() {
      await this.$store.dispatch(`fileSelectionDialog/select`);
    }
  }
};
</script>

<style scoped>
.modal-card-body {
  position: relative;
  height: 60vh;
}

.modal-card-foot {
  display: flex;
  justify-content: flex-end;
}
</style>
