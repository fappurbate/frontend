<template>
  <div class="card">
    <div class="card-image">
      <img :src="`data:image/png;base64,${image.thumbnail}`"
        :title="image.filename" />
    </div>

    <hr />
    <div class="card-content">
      <div>{{ image.filename }}</div>
      <b-dropdown hoverable>
        <b-icon slot="trigger" class="menu-icon" icon="dots-vertical" size="is-small" />

        <b-dropdown-item class="item item-remove" @click="onRemove">
          Remove
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
    async onRemove() {
      await this.$store.dispatch('gallery/removeFile', { fileId: this.image.id });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

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
}

.item:hover {
  color: $secondary !important;
  background: transparent !important;
}

.item-remove:hover {
  color: $danger !important;
}
</style>
