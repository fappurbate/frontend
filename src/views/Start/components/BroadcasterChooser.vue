<template>
  <b-dropdown hoverable>
    <button class="button is-primary" type="button" slot="trigger">
      <span>Choose broadcaster</span>
      <b-icon icon="menu-down"></b-icon>
    </button>

    <b-dropdown-item v-for="username in items" :key="username" class="item-broadcaster">
      <div class="username" @click="onChoose(username)">{{ username }}</div>
      <div class="remove" @click="onRemove(username)">
        <b-icon size="is-small" icon="minus"></b-icon>
      </div>
    </b-dropdown-item>

    <hr class="dropdown-divider" v-if="items.length > 0" />
    <b-dropdown-item key="__add" class="item-add"
        @click="onAdd">
      <b-icon class="remove" size="is-small" icon="plus"></b-icon>
    </b-dropdown-item>
  </b-dropdown>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data: () => ({
    broadcaster: ''
  }),
  computed: {
    items() {
      return this.broadcasters.map(b => b.username);
    },
    ...mapState({
      broadcasters: state => state.broadcasters.data
    })
  },
  methods: {
    onChoose(broadcaster) {
      this.$router.push({ name: 'dashboard', params: { broadcaster }});
    },
    onAdd() {
      this.$dialog.prompt({
        message: `Add a broadcaster`,
        inputAttrs: {
            placeholder: 'e.g. Walter'
        },
        onConfirm: username => {
          if (username) {
            this.$store.dispatch('broadcasters/add', username)
              .catch(error => this.$dialog.alert({
                title: `Failed to add '${username}'`,
                message: error.message,
                type: 'is-danger'
              }));
          }
        }
      });
    },
    onRemove(username) {
      this.$store.dispatch('broadcasters/remove', username)
        .catch(error => this.$dialog.alert({
          title: `Failed to remove '${username}'`,
          message: error.message,
          type: 'is-danger'
        }));
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../../main";

.dropdown-item:hover {
  color: initial !important;
}

.item-broadcaster {
  display: flex;
  align-items: center;

  > .username {
   flex-grow: 1;
   transition: color $color-change-duration;
 }

  > .username:hover {
    color: $secondary;
  }

  > .remove {
    transition: color $color-change-duration;
    font-size: 1.1rem;
  }

  > .remove:hover {
    color: $danger;
  }
}

.item-add {
  text-align: center !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  font-size: 1.4rem;
  line-height: 70%;
}

.item-add:hover {
  color: $success !important;
}
</style>
