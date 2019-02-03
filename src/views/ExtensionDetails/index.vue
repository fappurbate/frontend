<template>
  <fragment>
    <Navigation />

    <v-content>
      <v-tabs centered slider-color="secondary">
        <v-tab :to="`/${broadcaster}/extension/${extensionId}/front`">
          Front
        </v-tab>
        <v-tab :to="`/${broadcaster}/extension/${extensionId}/settings`">
          Settings
        </v-tab>
        <v-tab :to="`/${broadcaster}/extension/${extensionId}/debug`">
          Debug
        </v-tab>
      </v-tabs>

      <div class="content">
        <router-view></router-view>
      </div>
    </v-content>
  </fragment>
</template>

<script>
import Navigation from '../../components/Navigation';

export default {
  components: {
    Navigation
  },
  computed: {
    broadcaster() {
      return this.$route.params.broadcaster;
    },
    extensionId() {
      return this.$route.params.extensionId;
    }
  }
};
</script>

<style scoped>
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 48px;
  bottom: 0;
}
</style>
