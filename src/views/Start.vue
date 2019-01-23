<template>
  <v-content>
    <div id="title">Kothique Chaturbate Kit</div>
    <div id="broadcaster-chooser-container">
      <BroadcasterChooser />
    </div>
  </v-content>
</template>

<script>
import BroadcasterChooser from '../components/BroadcasterChooser';

export default {
  components: {
    BroadcasterChooser
  }
}
</script>

<style scoped>
#title {
  font-size: 10vh;
  text-align: center;
  margin-top: 30vh;
  margin-bottom: 10vh;
}

#broadcaster-chooser-container {
  margin-left: auto;
  margin-right: auto;
  width: 20rem;
}
</style>
