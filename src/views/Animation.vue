<template>
  <Layout>
    <Frame v-for="{ page, extension }, id in data" :key="id"
      :srcdoc="page" :extension="extension" class="frame" />
    <div class="overlay" @click.stop.prevent=""></div>
  </Layout>
</template>

<script>
import { mapState } from 'vuex';
import Layout from '../components/Layout';
import Frame from '../components/ExtensionFrame';

export default {
  components: {
    Layout,
    Frame
  },
  computed: {
    ...mapState({
      loading: state => state.animationPage.loading,
      error: state => state.animationPage.error,
      data: state => state.animationPage.data
    })
  },
  async created() {
    await this.$store.dispatch('animationPage/update', {
      broadcaster: this.$route.params.broadcaster
    });
  },
  async beforeRouteUpdate(to, from, next) {
    await this.$store.dispatch('animationPage/update', {
      broadcaster: to.params.broadcaster
    });
    next();
  }
}
</script>

<style scoped>
.overlay, .frame {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  height: 100%;
}
</style>
