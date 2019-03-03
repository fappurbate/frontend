<template>
  <div class="card">
    <div class="card-image">
      <img :src="`data:image/png;base64,${image.thumbnail}`" class="image"
        :title="image.filename" @click="$emit('preview')" />
    </div>

    <hr />
    <div class="card-content">
      <div>{{ image.filename }}</div>

      <template v-if="!select">
        <b-dropdown v-for="mobile of [true, false]" :hoverable="!mobile" :class="{
              'is-hidden-mobile': !mobile,
              'is-hidden-tablet': mobile
            }">
          <b-icon slot="trigger" class="menu-icon" icon="dots-vertical" size="is-small" />

          <b-dropdown-item class="item" @click="onShowOriginal(image.id)">
            <b-icon class="dropdown-icon" icon="image" size="is-small"></b-icon>
            <span>Original</span>
          </b-dropdown-item>
          <b-dropdown-item class="item item-remove" size="is-small" @click="onRemove">
            <b-icon class="dropdown-icon" icon="trash-can" size="is-small"></b-icon>
            <span>Remove</span>
          </b-dropdown-item>
        </b-dropdown>
      </template>

      <b-radio v-else-if="select && !multiple" class="radio"
        size="is-small" type="is-secondary" :native-value="image.id"
        :value="value" @input="$emit('input', $event)">
      </b-radio>

      <b-checkbox v-else-if="select && multiple" class="checkbox"
        size="is-small" type="is-secondary" :native-value="image.id"
        :value="value" @input="$emit('input', $event)">
      </b-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: Object,
    select: { type: Boolean, default: false },
    multiple: { type: Boolean, default: false },
    selected: { type: Boolean, default: false },
    value: { validator: () => true }
  },
  methods: {
    onShowOriginal(fileId) {
      window.open(`/api/gallery/${fileId}`, '_blank')
    },
    async onRemove() {
      await this.$store.dispatch('gallery/removeFile', { fileId: this.image.id });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

.image {
  cursor: zoom-in;
}

.card {
  border-radius: 2px;
  padding: 0.5rem;

  transition: border-color 200ms;
  border: 1px solid rgba(0, 0, 0, 0);
}

.card:hover {
  border-color: $secondary;
}

.card-content {
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

img {
  width: 100%;
}

hr {
  margin: 0;
  margin-bottom: 0.5rem;
}

.menu-icon {
  transition: red 200ms;
  padding: 0 0.5rem;
}

.menu-icon:hover {
  color: $primary;
}

.item {
  transition: color 200ms;

  display: flex;
  align-items: center;
}

.dropdown-icon {
  margin-right: 0.5rem;
}

.item:hover {
  color: $secondary !important;
  background: transparent !important;
}

.item-remove:hover {
  color: $danger !important;
}

.radio {
  width: 15px;
}
</style>
