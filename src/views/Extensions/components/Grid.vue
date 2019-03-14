<template>
  <div class="grid-container">
    <div class="grid">
      <Extension
        v-for="extension of extensions"
        :key="extension.id"
        :extension="extension" />
    </div>
    <button class="load-more button is-text is-rounded" @click="$emit('more')">
      More
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Extension from '../../../components/Extension';

export default {
  components: {
    Extension
  },
  computed: {
    ...mapState({
      extensions: state => state.extensionsPage.data
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../../../main";

.grid-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;

  overflow: hidden;

  margin: 1.5rem;
  margin-top: 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 320px);
  grid-gap: 1rem;
  justify-content: center;
  max-width: 1400px;

  overflow-y: auto;
  padding: 1rem;
}

.load-more {
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translate(-50%, -150%);

  transition: opacity $color-change-duration;
  opacity: 0.5;
}

.load-more:hover {
  opacity: 1;
}

.load-more:focus {
  border: 0;
  box-shadow: none;
}
</style>
