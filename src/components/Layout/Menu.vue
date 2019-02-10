<template>
  <aside class="menu">
    <ul class="menu-list">
      <li v-for="item, index in items" :key="index">
        <a :class="itemClass(item.route)" @click="$router.push(item.path)">
          {{ item.title }}
        </a>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  props: {
    items: Array
  },
  methods: {
    itemClass(name) {
      return {
        'is-active': this.$route.name === name
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../main";

.menu {
  min-width: 200px;
  width: 200px;
  margin: 1.5rem;
  margin-top: 15vh;
}

.menu-list a.is-active {
  border: 2px solid $secondary;
}
</style>
