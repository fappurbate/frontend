<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ extension.name }}
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        {{ extension.description }}
      </div>
    </div>
    <footer class="card-footer">
      <RemoveButton :extension="extension" class="card-footer-item" />
      <PowerButton :extension="extension" class="card-footer-item" />
      <a @click="$router.push(`/${broadcaster}/extension/${extension.id}`)"
          class="details card-footer-item">
        Details
      </a>
    </footer>
  </div>
</template>

<script>
import PowerButton from './PowerButton';
import RemoveButton from './RemoveButton';

export default {
  components: {
    PowerButton,
    RemoveButton
  },
  props: ['extension'],
  computed: {
    broadcaster() {
      return this.$route.params.broadcaster;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

a.details {
  transition: color 200ms;
}

a.details:hover {
  color: $secondary;
}
</style>
