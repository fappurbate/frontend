<template>
  <div class="card">
    <div class="card-image">
      <img :src="`data:image/png;base64,${image.thumbnail}`" class="image"
        :title="image.filename" @click="$emit('preview')" />
    </div>

    <hr />
    <div class="card-content">
      <div>{{ image.filename }}</div>
      <b-dropdown hoverable>
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
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: Object
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
  padding: 0 0.5rem;

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
</style>
